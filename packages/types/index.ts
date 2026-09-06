/**
 * @xyz-eyewear/types
 * Shared TypeScript types and interfaces used across web and api apps.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  COD = 'COD',
  MOCK = 'MOCK',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER',
}

export enum Gender {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  UNISEX = 'UNISEX',
  KIDS = 'KIDS',
}

export enum FrameType {
  FULL_RIM = 'FULL_RIM',
  HALF_RIM = 'HALF_RIM',
  RIMLESS = 'RIMLESS',
}

export enum FrameShape {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
  RECTANGLE = 'RECTANGLE',
  OVAL = 'OVAL',
  CAT_EYE = 'CAT_EYE',
  AVIATOR = 'AVIATOR',
  WAYFARER = 'WAYFARER',
  GEOMETRIC = 'GEOMETRIC',
  CLUBMASTER = 'CLUBMASTER',
  SPORT = 'SPORT',
}

export enum FrameMaterial {
  METAL = 'METAL',
  ACETATE = 'ACETATE',
  TITANIUM = 'TITANIUM',
  TR90 = 'TR90',
  WOOD = 'WOOD',
  CARBON_FIBER = 'CARBON_FIBER',
  MIXED = 'MIXED',
}

export enum LensType {
  SINGLE_VISION = 'SINGLE_VISION',
  PROGRESSIVE = 'PROGRESSIVE',
  BIFOCAL = 'BIFOCAL',
  TORIC = 'TORIC',
  MULTIFOCAL = 'MULTIFOCAL',
}

export enum LensCoating {
  ANTI_REFLECTIVE = 'ANTI_REFLECTIVE',
  UV_PROTECTION = 'UV_PROTECTION',
  BLUE_LIGHT_BLOCKING = 'BLUE_LIGHT_BLOCKING',
  PHOTOCHROMIC = 'PHOTOCHROMIC',
  POLARIZED = 'POLARIZED',
  SCRATCH_RESISTANT = 'SCRATCH_RESISTANT',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export enum NotificationType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  PRESCRIPTION_EXPIRING = 'PRESCRIPTION_EXPIRING',
  LOW_STOCK_ALERT = 'LOW_STOCK_ALERT',
  REVIEW_APPROVED = 'REVIEW_APPROVED',
  COUPON_EXPIRING = 'COUPON_EXPIRING',
  MEMBERSHIP_EXPIRING = 'MEMBERSHIP_EXPIRING',
  SYSTEM = 'SYSTEM',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum FaceShape {
  OVAL = 'OVAL',
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
  HEART = 'HEART',
  DIAMOND = 'DIAMOND',
  OBLONG = 'OBLONG',
  TRIANGLE = 'TRIANGLE',
}

// ─── Core Entity Types ────────────────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  profile?: UserProfile;
  membership?: Membership;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  avatarUrl?: string;
  faceShape?: FaceShape;
}

export interface Address extends BaseEntity {
  userId: string;
  type: AddressType;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  sortOrder: number;
  isActive: boolean;
}

export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  country?: string;
  website?: string;
  isPremium: boolean;
  isActive: boolean;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  color?: string;
  colorHex?: string;
  size?: string;
  frameWidth?: number;
  frameMaterial?: FrameMaterial;
  price: number;
  comparePrice?: number;
  stock: number;
  isDefault: boolean;
  images?: ProductMedia[];
}

export interface ProductMedia extends BaseEntity {
  productId: string;
  variantId?: string;
  url: string;
  type: MediaType;
  altText?: string;
  sortOrder: number;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  gender: Gender;
  shape: FrameShape;
  frameType: FrameType;
  frameWidth?: number;
  weight?: number;
  lensWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
  prescriptionCompatible: boolean;
  recommendedFaceShapes?: FaceShape[];
  status: ProductStatus;
  variants: ProductVariant[];
  media: ProductMedia[];
  basePrice: number;
  baseComparePrice?: number;
  averageRating: number;
  reviewCount: number;
  tags?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export interface LensConfig {
  lensType: string;
  lensPackage: string;
  coatings: string[];
  price: number;
  prescriptionData?: {
    type: 'manual' | 'upload' | 'later';
    rightEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
    leftEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
    pd?: string;
    fileName?: string;
  };
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  prescriptionId?: string;
  unitPrice: number;
  totalPrice: number;
  lensConfig?: LensConfig;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  couponCode?: string;
  appliedCoupon?: Coupon;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  addedAt: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  invoiceUrl?: string;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  product?: Product;
  variantId: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionId?: string;
  lensConfig?: {
    lensType: string;
    lensPackage: string;
    coatings: string[];
    price: number;
    prescriptionData?: {
      type: 'manual' | 'upload' | 'later';
      rightEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
      leftEye?: { sph?: string; cyl?: string; axis?: string; add?: string };
      pd?: string;
      fileName?: string;
    };
  };
}

export interface Review extends BaseEntity {
  userId: string;
  user?: Pick<UserProfile, 'firstName' | 'lastName' | 'avatarUrl'>;
  productId: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  images?: string[];
}

export interface Coupon extends BaseEntity {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  usedCount: number;
  perUserLimit?: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface Prescription extends BaseEntity {
  userId: string;
  name: string;
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  pd?: number;
  rightPd?: number;
  leftPd?: number;
  doctorName?: string;
  hospitalName?: string;
  prescriptionDate?: string;
  expiresAt?: string;
  fileUrl?: string;
  notes?: string;
  isActive: boolean;
}

export interface EyePrescription {
  sph?: number;
  cyl?: number;
  axis?: number;
  add?: number;
  prism?: number;
}

export interface EyeTestAppointment extends BaseEntity {
  userId: string;
  user?: User;
  storeId: string;
  store?: Store;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  doctorName?: string;
  notes?: string;
  reminderSent: boolean;
}

export interface Store extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email?: string;
  lat?: number;
  lng?: number;
  operatingHours: StoreHours;
  services?: string[];
  isActive: boolean;
  imageUrl?: string;
}

export interface StoreHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface MembershipPlan extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  price: number;
  duration: number;
  durationUnit: 'DAYS' | 'MONTHS' | 'YEARS';
  benefits: MembershipBenefit[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface MembershipBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface Membership extends BaseEntity {
  userId: string;
  planId: string;
  plan?: MembershipPlan;
  status: MembershipStatus;
  startsAt: string;
  endsAt: string;
  discountPercentage: number;
  autoRenew: boolean;
}

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
}

export interface CmsPage extends BaseEntity {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  sections: CmsSection[];
}

export interface CmsSection extends BaseEntity {
  pageId: string;
  type: string;
  content: Record<string, unknown>;
  sortOrder: number;
  isActive: boolean;
}

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  authorId: string;
  author?: UserProfile;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  readTime?: number;
}

export interface MediaFile extends BaseEntity {
  url: string;
  key: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  folderId?: string;
  folder?: MediaFolder;
}

export interface MediaFolder extends BaseEntity {
  name: string;
  slug: string;
  parentId?: string;
  parent?: MediaFolder;
  fileCount: number;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser extends User {
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// ─── Filter & Sort Types ──────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  brand?: string | string[];
  gender?: Gender | Gender[];
  shape?: FrameShape | FrameShape[];
  frameType?: FrameType | FrameType[];
  material?: FrameMaterial | FrameMaterial[];
  color?: string | string[];
  faceShape?: FaceShape | FaceShape[];
  minPrice?: number;
  maxPrice?: number;
  prescriptionCompatible?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
  tags?: string[];
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'popular'
  | 'rating'
  | 'name_asc'
  | 'name_desc';

// ─── Analytics Types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    growth: number;
  };
  orders: {
    today: number;
    pending: number;
    processing: number;
    total: number;
    growth: number;
  };
  customers: {
    total: number;
    newToday: number;
    activeThisMonth: number;
    growth: number;
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
  };
  conversionRate: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}
