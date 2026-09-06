/**
 * Storage Abstraction Layer
 * Supports: Local filesystem | AWS S3 | Cloudinary
 * Switch drivers by setting STORAGE_DRIVER env variable.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  width?: number;
  height?: number;
  mimeType: string;
}

export interface StorageDriver {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

// ─── Local Storage Driver ─────────────────────────────────────────────────────

class LocalStorageDriver implements StorageDriver {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    this.baseUrl = `${env.API_URL}/uploads`;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder = 'general'): Promise<UploadResult> {
    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const key = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(this.uploadDir, key);

    let width: number | undefined;
    let height: number | undefined;

    if (file.mimetype.startsWith('image/')) {
      // Optimize image with sharp
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      await image
        .webp({ quality: 85 })
        .toFile(filePath.replace(/\.[^.]+$/, '.webp'));

      const optimizedKey = key.replace(/\.[^.]+$/, '.webp');
      const url = `${this.baseUrl}/${optimizedKey}`;

      return {
        url,
        key: optimizedKey,
        size: file.size,
        width,
        height,
        mimeType: 'image/webp',
      };
    } else {
      fs.writeFileSync(filePath, file.buffer);
      return {
        url: `${this.baseUrl}/${key}`,
        key,
        size: file.size,
        mimeType: file.mimetype,
      };
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    // Local storage: just return the public URL
    return `${this.baseUrl}/${key}`;
  }
}

// ─── S3 Storage Driver ────────────────────────────────────────────────────────

class S3StorageDriver implements StorageDriver {
  async upload(file: Express.Multer.File, folder = 'general'): Promise<UploadResult> {
    // TODO Phase 7: Implement AWS S3 upload using @aws-sdk/client-s3
    logger.warn('S3 driver not fully configured. Falling back to local.');
    const localDriver = new LocalStorageDriver();
    return localDriver.upload(file, folder);
  }

  async delete(key: string): Promise<void> {
    logger.warn(`S3 delete not implemented for key: ${key}`);
  }

  async getSignedUrl(key: string): Promise<string> {
    return `${env.AWS_S3_BASE_URL}/${key}`;
  }
}

// ─── Cloudinary Storage Driver ────────────────────────────────────────────────

class CloudinaryStorageDriver implements StorageDriver {
  async upload(file: Express.Multer.File, folder = 'general'): Promise<UploadResult> {
    // TODO Phase 7: Implement Cloudinary upload using cloudinary SDK
    logger.warn('Cloudinary driver not fully configured. Falling back to local.');
    const localDriver = new LocalStorageDriver();
    return localDriver.upload(file, folder);
  }

  async delete(key: string): Promise<void> {
    logger.warn(`Cloudinary delete not implemented for key: ${key}`);
  }

  async getSignedUrl(key: string): Promise<string> {
    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${key}`;
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

const createStorageDriver = (): StorageDriver => {
  switch (env.STORAGE_DRIVER) {
    case 's3':
      return new S3StorageDriver();
    case 'cloudinary':
      return new CloudinaryStorageDriver();
    case 'local':
    default:
      return new LocalStorageDriver();
  }
};

export const storage = createStorageDriver();
logger.info(`📁 Storage driver: ${env.STORAGE_DRIVER}`);
