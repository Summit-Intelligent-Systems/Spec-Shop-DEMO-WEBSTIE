import { Router, type Request, type Response } from 'express';
import { sendSuccess } from '../../shared/utils';

export const membershipRouter = Router();

const PLANS = [
  {
    id: 'plan-gold',
    name: 'XYZ Gold Club',
    price: 1999,
    durationMonths: 12,
    benefits: [
      'Buy 1 Get 1 Complimentary frame on all prescription orders',
      'Free unlimited home eye exams for your entire household',
      'Priority optical milling within 24 hours',
      'Free annual lens scratch replacement',
    ],
  },
  {
    id: 'plan-platinum',
    name: 'XYZ Platinum Concierge',
    price: 3999,
    durationMonths: 12,
    benefits: [
      'Complimentary frame every 6 months included',
      'Dedicated personal eyewear stylist & optometrist hotline',
      'Worldwide travel emergency replacement assurance',
      'Invitations to annual haute couture private collection drops',
    ],
  },
];

membershipRouter.get('/plans', (_req: Request, res: Response): void => {
  sendSuccess(res, PLANS);
});
