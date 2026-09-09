import { Router, type Request, type Response, type NextFunction } from 'express';
import { sendSuccess, sendPaginated } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  updateProductStatus,
  duplicateProduct,
  bulkUpdateProducts,
  deleteAdminProduct,
} from './products.admin.service';

export const productsAdminRouter = Router();

/**
 * GET /admin/products
 * List all products with filters, search, sort, pagination
 */
productsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { products, page, limit, total } = await getAdminProducts({
      search: req.query.search as string,
      status: req.query.status as string,
      categoryId: req.query.categoryId as string,
      brandId: req.query.brandId as string,
      gender: req.query.gender as string,
      isFeatured: req.query.isFeatured as string,
      isNewArrival: req.query.isNewArrival as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });
    sendPaginated(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/products/:id
 * Get a single product with full details
 */
productsAdminRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await getAdminProductById(req.params.id);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /admin/products
 * Create a new product
 */
productsAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await createAdminProduct(req.body);
    auditFromReq(req, 'CREATE', 'Product', product.id, product.name);
    sendSuccess(res, product, 201);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /admin/products/:id
 * Update a product
 */
productsAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await updateAdminProduct(req.params.id, req.body);
    auditFromReq(req, 'UPDATE', 'Product', product.id, product.name);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /admin/products/:id/status
 * Update product status (publish / unpublish / archive)
 */
productsAdminRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await updateProductStatus(req.params.id, req.body.status);
    auditFromReq(req, 'STATUS_CHANGE', 'Product', product.id, product.name, { status: req.body.status });
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /admin/products/:id/duplicate
 * Duplicate a product
 */
productsAdminRouter.post('/:id/duplicate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await duplicateProduct(req.params.id);
    auditFromReq(req, 'CREATE', 'Product', product.id, product.name, { duplicatedFrom: req.params.id });
    sendSuccess(res, product, 201);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /admin/products/bulk
 * Bulk actions (publish, unpublish, archive, delete)
 */
productsAdminRouter.post('/bulk', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids, action } = req.body;
    const result = await bulkUpdateProducts(ids, action);
    auditFromReq(req, 'BULK_' + action.toUpperCase(), 'Product', undefined, `${ids.length} products`, { ids, action });
    sendSuccess(res, { affected: result.count });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /admin/products/:id
 * Delete a product
 */
productsAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await deleteAdminProduct(req.params.id);
    auditFromReq(req, 'DELETE', 'Product', req.params.id, product.name);
    sendSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
});
