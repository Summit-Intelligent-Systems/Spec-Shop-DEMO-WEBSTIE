import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const prescriptionsRouter = Router();

const PRESCRIPTIONS_STORE: any[] = [
  {
    id: 'rx-101',
    userId: 'user-001',
    name: 'Dr. Shroff Clinic — Computer Glasses',
    doctorName: 'Dr. A. Shroff, MS Ophthalmology',
    hospitalName: 'Apollo Spectra Eye Clinic',
    prescriptionDate: '2026-06-15',
    rightEye: { sph: -1.5, cyl: -0.5, axis: 90, add: null },
    leftEye: { sph: -1.75, cyl: -0.25, axis: 85, add: null },
    pd: 63,
    fileUrl: '/images/product-craft.jpg',
    status: 'VERIFIED',
    createdAt: '2026-06-15T10:00:00.000Z',
  },
  {
    id: 'rx-102',
    userId: 'user-001',
    name: 'Dr. Mehta — Reading & Progressive',
    doctorName: 'Dr. K. Mehta',
    hospitalName: 'Bangalore Eye Institute',
    prescriptionDate: '2026-08-20',
    rightEye: { sph: -2.0, cyl: -0.75, axis: 95, add: 1.5 },
    leftEye: { sph: -2.25, cyl: -0.5, axis: 80, add: 1.5 },
    pd: 64,
    status: 'VERIFIED',
    createdAt: '2026-08-20T14:30:00.000Z',
  },
];

prescriptionsRouter.get('/', optionalAuth, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const list = PRESCRIPTIONS_STORE.filter((p) => !userId || p.userId === userId || p.userId === 'user-001');
  sendSuccess(res, list);
});

prescriptionsRouter.post('/', optionalAuth, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const data = req.body;
  const newRx = {
    id: `rx-${Date.now()}`,
    userId,
    name: data.name || 'My Optical Prescription',
    doctorName: data.doctorName || 'Dr. Self Reported',
    hospitalName: data.hospitalName || 'Clinical Eye Test',
    prescriptionDate: data.prescriptionDate || new Date().toISOString().split('T')[0],
    rightEye: data.rightEye || { sph: 0, cyl: 0, axis: 0 },
    leftEye: data.leftEye || { sph: 0, cyl: 0, axis: 0 },
    pd: Number(data.pd) || 63,
    fileUrl: data.fileUrl || null,
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
  };

  PRESCRIPTIONS_STORE.unshift(newRx);
  sendSuccess(res, newRx, 201);
});

prescriptionsRouter.delete('/:id', optionalAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const idx = PRESCRIPTIONS_STORE.findIndex((p) => p.id === id);
  if (idx >= 0) PRESCRIPTIONS_STORE.splice(idx, 1);
  sendSuccess(res, { message: 'Prescription removed' });
});
