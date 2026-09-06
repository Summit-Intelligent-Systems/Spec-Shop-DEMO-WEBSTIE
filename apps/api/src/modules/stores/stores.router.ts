import { Router, type Request, type Response } from 'express';
import { sendSuccess } from '../../shared/utils';

export const storesRouter = Router();

const STORES = [
  {
    id: 'store-blr-01',
    name: 'Indiranagar Flagship Boutique',
    slug: 'indiranagar-flagship',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '42, 100ft Road, Indiranagar',
    pincode: '560038',
    phone: '+91 80 4123 4567',
    email: 'indiranagar@xyz-eyewear.com',
    openingHours: '10:00 AM – 09:30 PM (Daily)',
    hasEyeTesting: true,
    hasVirtualTryOn: true,
    hasLounge: true,
    latitude: 12.9716,
    longitude: 77.6412,
    images: ['/images/category-sunglasses.jpg', '/images/product-craft.jpg'],
  },
  {
    id: 'store-mum-01',
    name: 'Bandra West Luxury Salon',
    slug: 'bandra-west-salon',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Plot 15, Turner Road, Bandra West',
    pincode: '400050',
    phone: '+91 22 2640 8900',
    email: 'bandra@xyz-eyewear.com',
    openingHours: '10:30 AM – 10:00 PM (Daily)',
    hasEyeTesting: true,
    hasVirtualTryOn: true,
    hasLounge: true,
    latitude: 19.0596,
    longitude: 72.8295,
    images: ['/images/category-men.jpg', '/images/hero-banner.jpg'],
  },
  {
    id: 'store-del-01',
    name: 'Khan Market Optical Emporium',
    slug: 'khan-market-emporium',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Shop 24A, Middle Lane, Khan Market',
    pincode: '110003',
    phone: '+91 11 2465 7788',
    email: 'khanmarket@xyz-eyewear.com',
    openingHours: '10:00 AM – 09:00 PM (Closed Tuesday)',
    hasEyeTesting: true,
    hasVirtualTryOn: true,
    hasLounge: true,
    latitude: 28.6003,
    longitude: 77.2273,
    images: ['/images/product-craft.jpg', '/images/category-sunglasses.jpg'],
  },
];

storesRouter.get('/', (req: Request, res: Response): void => {
  const { city } = req.query;
  let list = STORES;
  if (city) {
    list = list.filter((s) => s.city.toLowerCase() === String(city).toLowerCase());
  }
  sendSuccess(res, list);
});

storesRouter.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const store = STORES.find((s) => s.id === id || s.slug === id) || STORES[0];
  sendSuccess(res, store);
});
