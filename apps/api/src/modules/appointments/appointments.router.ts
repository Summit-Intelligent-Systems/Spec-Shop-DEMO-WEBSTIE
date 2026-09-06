import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const appointmentsRouter = Router();

const APPOINTMENTS_STORE: any[] = [
  {
    id: 'apt-501',
    userId: 'user-001',
    serviceType: 'HOME_EXAM',
    date: '2026-09-12',
    timeSlot: '11:00 AM',
    status: 'CONFIRMED',
    clientName: 'Devan Sharma',
    clientPhone: '+91 98765 43210',
    address: '42, Indiranagar 100ft Road, Bengaluru',
    optometrist: 'Dr. Rajesh Nair (Certified Senior Optometrist)',
    notes: 'Requested 100+ titanium trial frames.',
    createdAt: new Date().toISOString(),
  },
];

appointmentsRouter.get('/', optionalAuth, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const list = APPOINTMENTS_STORE.filter((a) => !userId || a.userId === userId || a.userId === 'user-001');
  sendSuccess(res, list);
});

appointmentsRouter.post('/', optionalAuth, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const data = req.body;
  const newApt = {
    id: `apt-${Date.now()}`,
    userId,
    serviceType: data.serviceType || 'HOME_EXAM',
    date: data.date || 'Tomorrow',
    timeSlot: data.timeSlot || '11:00 AM',
    status: 'CONFIRMED',
    clientName: data.clientName || 'Valued Client',
    clientPhone: data.clientPhone || '+91 98765 00000',
    address: data.address || 'Indiranagar Flagship Boutique',
    optometrist: 'Senior Certified Optometrist',
    createdAt: new Date().toISOString(),
  };

  APPOINTMENTS_STORE.unshift(newApt);
  sendSuccess(res, newApt, 201);
});

appointmentsRouter.patch('/:id', optionalAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const apt = APPOINTMENTS_STORE.find((a) => a.id === id);
  if (apt) {
    Object.assign(apt, req.body, { updatedAt: new Date().toISOString() });
  }
  sendSuccess(res, apt);
});
