/**
 * XYZ Eyewear — Database Seed
 * Seeds essential data for development.
 * Run with: npm run db:seed (from apps/api)
 */

import {
  PrismaClient,
  UserRole,
  ProductStatus,
  Gender,
  FrameShape,
  FrameType,
  FrameMaterial,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Super Admin ───────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('Admin@123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@xyzeyewear.com' },
    update: {},
    create: {
      email: 'superadmin@xyzeyewear.com',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          displayName: 'Super Admin',
          phone: '9876543210',
        },
      },
    },
  });
  console.log(`✅ Super Admin: ${superAdmin.email}`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@xyzeyewear.com' },
    update: {},
    create: {
      email: 'admin@xyzeyewear.com',
      passwordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          displayName: 'Admin User',
          phone: '9876543211',
        },
      },
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: await bcrypt.hash('Customer@123!', 12),
      role: UserRole.CUSTOMER,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Priya',
          lastName: 'Sharma',
          displayName: 'Priya S.',
          phone: '9876543212',
        },
      },
    },
  });
  console.log(`✅ Customer: ${customer.email}`);

  // ─── Categories ────────────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'eyeglasses' },
      update: {},
      create: { name: 'Eyeglasses', slug: 'eyeglasses', sortOrder: 1, isActive: true, description: 'Premium prescription eyeglasses for every style' },
    }),
    prisma.category.upsert({
      where: { slug: 'sunglasses' },
      update: {},
      create: { name: 'Sunglasses', slug: 'sunglasses', sortOrder: 2, isActive: true, description: 'Designer sunglasses with UV protection' },
    }),
    prisma.category.upsert({
      where: { slug: 'computer-glasses' },
      update: {},
      create: { name: 'Computer Glasses', slug: 'computer-glasses', sortOrder: 3, isActive: true, description: 'Blue light blocking glasses for screen time' },
    }),
    prisma.category.upsert({
      where: { slug: 'contact-lenses' },
      update: {},
      create: { name: 'Contact Lenses', slug: 'contact-lenses', sortOrder: 4, isActive: true, description: 'Comfortable contact lenses for daily wear' },
    }),
    prisma.category.upsert({
      where: { slug: 'kids' },
      update: {},
      create: { name: "Kids' Eyewear", slug: 'kids', sortOrder: 5, isActive: true, description: 'Durable and fun eyewear for children' },
    }),
    prisma.category.upsert({
      where: { slug: 'premium' },
      update: {},
      create: { name: 'Premium Collection', slug: 'premium', sortOrder: 6, isActive: true, description: 'Exclusive designer frames for the discerning eye' },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // ─── Brands ────────────────────────────────────────────────────────────────

  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'xyz-originals' },
      update: {},
      create: { name: 'XYZ Originals', slug: 'xyz-originals', description: 'Our signature house brand', country: 'India', isPremium: false, isActive: true, sortOrder: 1 },
    }),
    prisma.brand.upsert({
      where: { slug: 'vista-luxe' },
      update: {},
      create: { name: 'Vista Luxe', slug: 'vista-luxe', description: 'Italian-crafted luxury frames', country: 'Italy', isPremium: true, isActive: true, sortOrder: 2 },
    }),
    prisma.brand.upsert({
      where: { slug: 'urban-optics' },
      update: {},
      create: { name: 'Urban Optics', slug: 'urban-optics', description: 'Contemporary urban eyewear', country: 'India', isPremium: false, isActive: true, sortOrder: 3 },
    }),
    prisma.brand.upsert({
      where: { slug: 'nordic-frames' },
      update: {},
      create: { name: 'Nordic Frames', slug: 'nordic-frames', description: 'Minimalist Scandinavian design', country: 'Sweden', isPremium: true, isActive: true, sortOrder: 4 },
    }),
  ]);
  console.log(`✅ ${brands.length} brands created`);

  // ─── Sample Products ────────────────────────────────────────────────────────

  const sampleProduct = await prisma.product.upsert({
    where: { slug: 'classic-round-black-acetate' },
    update: {},
    create: {
      name: 'Classic Round Acetate',
      slug: 'classic-round-black-acetate',
      sku: 'XYZ-EG-001',
      description: 'Timeless round acetate frames with a premium finish. Lightweight, durable, and effortlessly stylish.',
      brandId: brands[0].id,
      categoryId: categories[0].id,
      gender: Gender.UNISEX,
      shape: FrameShape.ROUND,
      frameType: FrameType.FULL_RIM,
      basePrice: 1999,
      baseComparePrice: 2999,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: true,
      prescriptionCompatible: true,
      recommendedFaceShapes: ['SQUARE', 'OBLONG', 'HEART'],
      tags: ['round', 'acetate', 'unisex', 'classic'],
      variants: {
        create: [
          {
            sku: 'XYZ-EG-001-BLK-M',
            color: 'Matte Black',
            colorHex: '#1A1A1A',
            size: 'Medium',
            frameMaterial: FrameMaterial.ACETATE,
            price: 1999,
            comparePrice: 2999,
            stock: 50,
            isDefault: true,
          },
          {
            sku: 'XYZ-EG-001-TOR-M',
            color: 'Tortoise',
            colorHex: '#8B4513',
            size: 'Medium',
            frameMaterial: FrameMaterial.ACETATE,
            price: 1999,
            comparePrice: 2999,
            stock: 30,
            isDefault: false,
          },
        ],
      },
    },
  });
  console.log(`✅ Sample product: ${sampleProduct.name}`);

  // ─── Membership Plans ──────────────────────────────────────────────────────

  await Promise.all([
    prisma.membershipPlan.upsert({
      where: { slug: 'silver' },
      update: {},
      create: {
        name: 'Silver',
        slug: 'silver',
        description: 'Perfect for occasional shoppers',
        price: 499,
        duration: 12,
        discountPercent: 10,
        freeEyeTests: 1,
        freeShipping: false,
        isActive: true,
        isFeatured: false,
        sortOrder: 1,
        benefits: [
          { icon: '💰', title: '10% Off Everything', description: 'On all products sitewide' },
          { icon: '👁️', title: '1 Free Eye Test', description: 'At any XYZ Eyewear store' },
          { icon: '📞', title: 'Priority Support', description: '24-hour response guarantee' },
          { icon: '🎯', title: 'Early Sale Access', description: 'Shop 24h before public' },
        ],
      },
    }),
    prisma.membershipPlan.upsert({
      where: { slug: 'gold' },
      update: {},
      create: {
        name: 'Gold',
        slug: 'gold',
        description: 'Most popular for regular buyers',
        price: 999,
        duration: 12,
        discountPercent: 20,
        freeEyeTests: 2,
        freeShipping: true,
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        benefits: [
          { icon: '💰', title: '20% Off Everything', description: 'On all products sitewide' },
          { icon: '👁️', title: '2 Free Eye Tests', description: 'At any XYZ Eyewear store' },
          { icon: '🚚', title: 'Free Shipping Always', description: 'No minimum order required' },
          { icon: '✨', title: 'Exclusive Collections', description: 'Members-only product drops' },
          { icon: '📞', title: 'Dedicated Support', description: 'Dedicated account manager' },
        ],
      },
    }),
    prisma.membershipPlan.upsert({
      where: { slug: 'platinum' },
      update: {},
      create: {
        name: 'Platinum',
        slug: 'platinum',
        description: 'Ultimate luxury experience',
        price: 1999,
        duration: 12,
        discountPercent: 30,
        freeEyeTests: 99,
        freeShipping: true,
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        benefits: [
          { icon: '💰', title: '30% Off Everything', description: 'Highest discount tier' },
          { icon: '👁️', title: 'Unlimited Eye Tests', description: 'Visit any time, any store' },
          { icon: '🚚', title: 'Express Shipping Free', description: 'Free express delivery always' },
          { icon: '💎', title: 'Designer Exclusives', description: 'Access premium limited editions' },
          { icon: '🎭', title: 'Style Consultant', description: 'Personal shopping assistant' },
          { icon: '🔄', title: 'Annual Lens Replacement', description: 'One free lens set per year' },
        ],
      },
    }),
  ]);
  console.log('✅ Membership plans created');

  // ─── Sample Store ──────────────────────────────────────────────────────────

  await prisma.store.upsert({
    where: { code: 'MUM-001' },
    update: {},
    create: {
      name: 'XYZ Eyewear — Bandra',
      code: 'MUM-001',
      address: '123 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
      phone: '+91 22 1234 5678',
      email: 'bandra@xyzeyewear.com',
      lat: 19.0544,
      lng: 72.8404,
      services: ['eye_test', 'lens_fitting', 'repairs', 'adjustments'],
      isActive: true,
      operatingHours: {
        monday: { open: '10:00', close: '20:00', isClosed: false },
        tuesday: { open: '10:00', close: '20:00', isClosed: false },
        wednesday: { open: '10:00', close: '20:00', isClosed: false },
        thursday: { open: '10:00', close: '20:00', isClosed: false },
        friday: { open: '10:00', close: '21:00', isClosed: false },
        saturday: { open: '10:00', close: '21:00', isClosed: false },
        sunday: { open: '11:00', close: '19:00', isClosed: false },
      },
    },
  });
  console.log('✅ Sample store created');

  // ─── CMS Pages ─────────────────────────────────────────────────────────────

  await prisma.cmsPage.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Homepage',
      isPublished: true,
      sections: {
        create: [
          {
            type: 'hero',
            name: 'Main Hero',
            sortOrder: 1,
            isActive: true,
            content: {
              headline: 'See the World\nIn Style',
              subtext: 'Premium eyewear crafted for those who see the world differently.',
              ctaPrimary: { text: 'Shop Now', href: '/shop' },
              ctaSecondary: { text: 'Virtual Try-On', href: '/try-on' },
              backgroundImage: '',
              badge: 'New Collection 2024',
            },
          },
          {
            type: 'announcement-banner',
            name: 'Top Banner',
            sortOrder: 0,
            isActive: true,
            content: {
              messages: [
                '🎉 New arrivals just dropped — Shop now',
                '🚚 Free shipping on orders above ₹999',
                '👁️ Book a free eye test at your nearest store',
              ],
              backgroundColor: '#0A0A0A',
              textColor: '#C9A84C',
            },
          },
        ],
      },
    },
  });
  console.log('✅ CMS home page created');

  // ─── Global CMS Settings ───────────────────────────────────────────────────

  await prisma.cmsGlobal.upsert({
    where: { key: 'footer' },
    update: {},
    create: {
      key: 'footer',
      label: 'Footer Settings',
      group: 'footer',
      value: {
        tagline: 'Premium eyewear for the discerning eye.',
        columns: [
          {
            title: 'Shop',
            links: [
              { label: 'Eyeglasses', href: '/shop/eyeglasses' },
              { label: 'Sunglasses', href: '/shop/sunglasses' },
              { label: 'Computer Glasses', href: '/shop/computer-glasses' },
              { label: 'New Arrivals', href: '/shop/new-arrivals' },
            ],
          },
          {
            title: 'Services',
            links: [
              { label: 'Eye Test Booking', href: '/eye-test' },
              { label: 'Virtual Try-On', href: '/try-on' },
              { label: 'Store Locator', href: '/stores' },
              { label: 'Prescription Upload', href: '/account/prescriptions' },
            ],
          },
          {
            title: 'Help',
            links: [
              { label: 'FAQ', href: '/faq' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'Returns', href: '/returns' },
              { label: 'Shipping Policy', href: '/shipping' },
            ],
          },
        ],
      },
    },
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest accounts:');
  console.log('  Super Admin: superadmin@xyzeyewear.com / Admin@123!');
  console.log('  Admin:       admin@xyzeyewear.com / Admin@123!');
  console.log('  Customer:    customer@example.com / Customer@123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
