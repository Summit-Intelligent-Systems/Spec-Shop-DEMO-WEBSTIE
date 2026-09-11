import { Router, type Request, type Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const usersRouter = Router();

const USER_PROFILES: Record<string, any> = {
  'user-001': {
    id: 'user-001',
    email: 'customer@nayansukh.com',
    firstName: 'Devan',
    lastName: 'Sharma',
    phone: '+91 98765 43210',
    avatarUrl: '/images/category-men.jpg',
    gender: 'MALE',
    dob: '1992-05-14',
    addresses: [
      {
        id: 'addr-1',
        type: 'HOME',
        line1: '42, Indiranagar 100ft Road',
        line2: 'Prestige Heights Apt 4B',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India',
        isDefault: true,
      },
      {
        id: 'addr-2',
        type: 'WORK',
        line1: 'Tower B, RMZ Infinity, Old Madras Rd',
        line2: 'Suite 802',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560016',
        country: 'India',
        isDefault: false,
      },
    ],
  },
};

usersRouter.get('/profile', authenticate, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const profile = USER_PROFILES[userId] || USER_PROFILES['user-001'];
  sendSuccess(res, profile);
});

usersRouter.put('/profile', authenticate, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  if (!USER_PROFILES[userId]) USER_PROFILES[userId] = { id: userId, ...USER_PROFILES['user-001'] };
  Object.assign(USER_PROFILES[userId], req.body);
  sendSuccess(res, USER_PROFILES[userId]);
});

usersRouter.get('/addresses', authenticate, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const profile = USER_PROFILES[userId] || USER_PROFILES['user-001'];
  sendSuccess(res, profile.addresses || []);
});

usersRouter.post('/addresses', authenticate, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  if (!USER_PROFILES[userId]) USER_PROFILES[userId] = { id: userId, ...USER_PROFILES['user-001'] };
  const newAddr = {
    id: `addr-${Date.now()}`,
    ...req.body,
    isDefault: req.body.isDefault ?? false,
  };
  USER_PROFILES[userId].addresses.push(newAddr);
  sendSuccess(res, newAddr, 201);
});

usersRouter.delete('/addresses/:id', authenticate, (req: Request, res: Response): void => {
  const userId = req.user?.id || 'user-001';
  const { id } = req.params;
  if (USER_PROFILES[userId]) {
    USER_PROFILES[userId].addresses = USER_PROFILES[userId].addresses.filter((a: any) => a.id !== id);
  }
  sendSuccess(res, { message: 'Address removed' });
});
