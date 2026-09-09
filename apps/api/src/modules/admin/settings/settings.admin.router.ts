import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const settingsAdminRouter = Router();

// GET /admin/settings — Get all settings (grouped)
settingsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const group = req.query.group as string;
    const where = group ? { group } : {};
    const settings = await prisma.siteSettings.findMany({ where, orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }] });

    // Group by category
    const grouped: Record<string, Array<{ id: string; key: string; value: unknown; type: string; label?: string | null }>> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    }
    sendSuccess(res, { settings, grouped });
  } catch (error) { next(error); }
});

// PUT /admin/settings — Bulk update settings
settingsAdminRouter.put('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { settings } = req.body; // [{ key, value, type?, label?, group? }]
    const results = await prisma.$transaction(
      settings.map((s: { key: string; value: unknown; type?: string; label?: string; group?: string; sortOrder?: number }) =>
        prisma.siteSettings.upsert({
          where: { key: s.key },
          update: { value: s.value as any, type: s.type, label: s.label },
          create: { key: s.key, value: s.value as any, type: s.type || 'string', label: s.label, group: s.group || 'general', sortOrder: s.sortOrder || 0 },
        })
      )
    );
    auditFromReq(req, 'UPDATE', 'SiteSettings', undefined, `${settings.length} settings`);
    sendSuccess(res, results);
  } catch (error) { next(error); }
});

// PUT /admin/settings/:key — Update single setting
settingsAdminRouter.put('/:key', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { value, type, label, group } = req.body;
    const setting = await prisma.siteSettings.upsert({
      where: { key: req.params.key },
      update: { value, type, label },
      create: { key: req.params.key, value, type: type || 'string', label, group: group || 'general' },
    });
    auditFromReq(req, 'UPDATE', 'SiteSettings', setting.id, req.params.key);
    sendSuccess(res, setting);
  } catch (error) { next(error); }
});
