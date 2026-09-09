import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const mediaAdminRouter = Router();

// GET /api/v1/admin/media - List media files with folder/search filters
mediaAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, page, limit } = calculatePagination(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 24
    );

    const folderId = req.query.folderId as string;
    const type = req.query.type as string;
    const search = req.query.search as string;

    const where: any = {};
    if (folderId) where.folderId = folderId;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [files, total, _folders] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { folder: true },
      }),
      prisma.mediaFile.count({ where }),
      prisma.mediaFolder.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { files: true } } },
      }),
    ]);

    // Fallback if no files in DB yet, serve mock/seed items so frontend has files
    if (total === 0) {
      const mockFiles = [
        { id: 'med-1', url: '/images/hero-banner.jpg', key: 'hero-banner.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 614225, createdAt: new Date() },
        { id: 'med-2', url: '/images/category-sunglasses.jpg', key: 'category-sunglasses.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 799540, createdAt: new Date() },
        { id: 'med-3', url: '/images/category-men.jpg', key: 'category-men.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 700608, createdAt: new Date() },
        { id: 'med-4', url: '/images/product-craft.jpg', key: 'product-craft.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 650290, createdAt: new Date() },
      ];
      sendPaginated(res, mockFiles, 1, limit, mockFiles.length);
      return;
    }

    sendPaginated(res, files, page, limit, total);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/media/folders - Create folder
mediaAdminRouter.post('/folders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, parentId } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const folder = await prisma.mediaFolder.create({
      data: { name, slug, parentId: parentId || null },
    });

    sendSuccess(res, folder, 201, { message: 'Folder created' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/media - Create/Record media upload
mediaAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, key, type, mimeType, size, width, height, altText, folderId } = req.body;
    const userId = (req as any).user?.id;

    const file = await prisma.mediaFile.create({
      data: {
        url,
        key: key || `file_${Date.now()}`,
        type: type || 'IMAGE',
        mimeType: mimeType || 'image/jpeg',
        size: size || 1024,
        width,
        height,
        altText,
        folderId: folderId || null,
        uploadedBy: userId,
      },
    });

    await auditFromReq(req, 'CREATE', 'MediaFile', file.id, file.key);

    sendSuccess(res, file, 201, { message: 'Media uploaded successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/media/:id - Delete media file
mediaAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.mediaFile.findUnique({ where: { id: req.params.id } });
    if (existing) {
      await prisma.mediaFile.delete({ where: { id: req.params.id } });
      await auditFromReq(req, 'DELETE', 'MediaFile', req.params.id, existing.key);
    }
    sendSuccess(res, { id: req.params.id }, 200, { message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
});
