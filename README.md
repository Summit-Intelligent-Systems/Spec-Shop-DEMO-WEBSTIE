# XYZ Eyewear — Premium E-Commerce Platform

<div align="center">

![XYZ Eyewear](./docs/banner.png)

**A world-class, production-grade full-stack e-commerce platform for a premium eyewear brand.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

</div>

---

## 🏗️ Architecture

This is a **Turborepo monorepo** containing:

```
xyz-eyewear/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   └── api/          # Express.js + TypeScript REST API
├── packages/
│   ├── types/        # Shared TypeScript types & interfaces
│   ├── utils/        # Shared utility functions
│   ├── config/       # Shared constants & configuration
│   └── ui/           # Shared design system UI primitives
└── ...
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/xyz-eyewear.git
cd xyz-eyewear
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3. Start Infrastructure (Docker)

```bash
npm run docker:dev
```

This starts: PostgreSQL, Redis, pgAdmin

### 4. Database Setup

```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed with sample data
npm run db:studio    # Open Prisma Studio (visual DB browser)
```

### 5. Start Development

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api-docs
- **pgAdmin**: http://localhost:5050
- **Prisma Studio**: http://localhost:5555

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with SSR/SSG |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Zustand | Client state management |
| React Query (TanStack) | Server state & data fetching |
| React Hook Form + Zod | Form handling & validation |

### Backend (`apps/api`)
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| TypeScript | Type safety |
| Prisma ORM | Database access layer |
| PostgreSQL | Primary database |
| Redis | Caching, sessions, rate limiting |
| JWT + Refresh Tokens | Authentication |
| Zod | Request validation |
| Winston | Logging |
| Nodemailer + Handlebars | Email templates |

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all apps |
| `npm run format` | Format all files with Prettier |
| `npm run type-check` | TypeScript type-check all apps |
| `npm run test` | Run all tests |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run docker:dev` | Start Docker development services |
| `npm run docker:prod` | Start Docker production services |

---

## 🗄️ Database Schema

25+ entities including: Users, Products, Categories, Brands, Orders, Reviews, Coupons, Inventory, Stores, Cart, Wishlist, Prescriptions, Eye Test Appointments, Membership Plans, CMS Pages, Media Files, Notifications, Blog Posts.

See [`apps/api/prisma/schema.prisma`](./apps/api/prisma/schema.prisma) for the full schema.

---

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for all required environment variables.

---

## 📁 Project Structure

### Frontend (`apps/web/src/`)
```
app/              # Next.js App Router pages
components/
  ui/             # Design system atoms (Button, Input, Badge, etc.)
  layout/         # Header, Footer, Navigation, MegaMenu
  product/        # Product cards, gallery, filters, comparison
  cart/           # Cart drawer, cart item, mini-cart
  checkout/       # Multi-step checkout flow
  auth/           # Auth forms & modals
  admin/          # Admin dashboard components
lib/
  api.ts          # Axios client with interceptors
  store/          # Zustand state stores
  hooks/          # Custom React hooks
  motion/         # Framer Motion animation variants
styles/
  globals.css     # Global styles + Tailwind directives
```

### Backend (`apps/api/src/`)
```
modules/          # Feature modules (router + service + repository)
  auth/           # JWT auth, email verification, 2FA
  users/          # User profiles, addresses
  products/       # Products, variants, media
  categories/     # Category tree
  brands/         # Brand management
  cart/           # Guest + user cart
  wishlist/       # Wishlist management
  orders/         # Orders, invoices, returns
  reviews/        # Reviews, ratings, moderation
  coupons/        # Coupon creation & validation
  inventory/      # Stock management, low-stock alerts
  stores/         # Physical store locator
  prescriptions/  # Rx upload & management
  appointments/   # Eye test booking
  membership/     # Premium membership plans
  cms/            # CMS pages & sections
  media/          # File upload & organization
  analytics/      # Sales & performance analytics
  notifications/  # Email, push, in-app notifications
middleware/       # Auth, RBAC, validation, error handling
infrastructure/
  storage/        # Local/S3/Cloudinary abstraction
  payment/        # Stripe/Razorpay/PayPal abstraction
  email/          # Email templates (Nodemailer + Handlebars)
```

---

## 🚢 Deployment

### Docker Compose (Production)
```bash
npm run docker:prod
```

### Environment
- **Frontend**: Vercel (recommended) or Docker
- **Backend**: Railway, Fly.io, or Docker
- **Database**: Managed PostgreSQL (Neon, Supabase, AWS RDS)
- **Cache**: Managed Redis (Upstash, Redis Cloud)
- **Storage**: AWS S3, Cloudinary, or local (dev)

---

## 🤝 Contributing

This is a proprietary codebase. Contact the development team for contribution guidelines.

---

## 📄 License

Proprietary — All rights reserved. © 2024 XYZ Eyewear.
