export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: 'eyeglasses' | 'sunglasses' | 'screen-glasses' | 'reading-glasses';
  categoryName: string;
  subCategory: 'men' | 'women' | 'unisex';
  frameShape: 'ROUND' | 'SQUARE' | 'AVIATOR' | 'CAT_EYE' | 'GEOMETRIC' | 'RECTANGLE';
  frameMaterial: 'ACETATE' | 'TITANIUM' | 'METAL' | 'TR90';
  frameType: 'FULL_RIM' | 'RIMLESS' | 'SEMI_RIMLESS';
  price: number;
  comparePrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isTryOnAvailable?: boolean;
  description: string;
  features: string[];
  dimensions: {
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
    frameWidth: number;
  };
  colors: Array<{
    name: string;
    hex: string;
    image: string;
  }>;
  recommendedFaceShapes: string[];
}

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    name: 'The Sovereign Round',
    slug: 'the-sovereign-round',
    category: 'eyeglasses',
    categoryName: 'Eyeglasses',
    subCategory: 'unisex',
    frameShape: 'ROUND',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    price: 3499,
    comparePrice: 4999,
    rating: 4.9,
    reviewCount: 142,
    badge: 'Bestseller',
    isBestseller: true,
    isTryOnAvailable: true,
    description: 'Precision-milled from premium 8mm organic Mazzucchelli acetate with custom wirecore filigree and 5-barrel custom hinges.',
    features: ['Hand-polished Japanese acetate', 'Anti-reflective sapphire coating', 'Hypoallergenic titanium nose pads', 'Scratch-resistant blue filter option'],
    dimensions: { lensWidth: 49, bridgeWidth: 20, templeLength: 145, frameWidth: 138 },
    colors: [
      { name: 'Dark Amber Tortoise', hex: '#633B18', image: '/images/product-craft.jpg' },
      { name: 'Obsidian Black', hex: '#111111', image: '/images/hero-banner.jpg' },
      { name: 'Crystal Slate', hex: '#94A3B8', image: '/images/category-men.jpg' },
    ],
    recommendedFaceShapes: ['Square', 'Oval', 'Heart'],
  },
  {
    id: 'prod-002',
    name: 'The Aviator Prime',
    slug: 'the-aviator-prime',
    category: 'sunglasses',
    categoryName: 'Sunglasses',
    subCategory: 'unisex',
    frameShape: 'AVIATOR',
    frameMaterial: 'TITANIUM',
    frameType: 'FULL_RIM',
    price: 4999,
    comparePrice: 6999,
    rating: 4.8,
    reviewCount: 89,
    badge: 'Polarized',
    isBestseller: true,
    isTryOnAvailable: true,
    description: 'Ultralight Japanese aerospace-grade titanium frame with polarized CR-39 sun lenses offering 100% UVA/UVB blockage.',
    features: ['Grade-5 pure titanium (14 grams)', 'Polarized UV400 lenses', 'Oleophobic smudge resistant', 'Laser-etched logo detailing'],
    dimensions: { lensWidth: 55, bridgeWidth: 17, templeLength: 140, frameWidth: 142 },
    colors: [
      { name: 'Champagne Gold', hex: '#C9A84C', image: '/images/category-sunglasses.jpg' },
      { name: 'Brushed Gunmetal', hex: '#475569', image: '/images/category-men.jpg' },
    ],
    recommendedFaceShapes: ['Oval', 'Square', 'Heart'],
  },
  {
    id: 'prod-003',
    name: 'The Kensington Square',
    slug: 'the-kensington-square',
    category: 'eyeglasses',
    categoryName: 'Eyeglasses',
    subCategory: 'men',
    frameShape: 'SQUARE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    price: 2999,
    comparePrice: 3999,
    rating: 4.7,
    reviewCount: 114,
    badge: 'Trending',
    isNew: true,
    isTryOnAvailable: true,
    description: 'A sharp architectural silhouette featuring bevel-cut acetate rims and brushed gold core wire for a distinguished executive aesthetic.',
    features: ['Beveled browline styling', 'German engineered spring hinges', 'Weight balanced temples', 'Available with digital screen protection'],
    dimensions: { lensWidth: 52, bridgeWidth: 19, templeLength: 145, frameWidth: 140 },
    colors: [
      { name: 'Matte Charcoal', hex: '#27272A', image: '/images/category-men.jpg' },
      { name: 'Tortoise Shell', hex: '#78350F', image: '/images/product-craft.jpg' },
    ],
    recommendedFaceShapes: ['Round', 'Oval'],
  },
  {
    id: 'prod-004',
    name: 'The Marais Cat-Eye',
    slug: 'the-marais-cat-eye',
    category: 'sunglasses',
    categoryName: 'Sunglasses',
    subCategory: 'women',
    frameShape: 'CAT_EYE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    price: 3999,
    comparePrice: 5499,
    rating: 5.0,
    reviewCount: 76,
    badge: 'Limited Edition',
    isNew: true,
    isTryOnAvailable: true,
    description: 'An audacious feminine silhouette inspired by mid-century Parisian haute couture, enhanced with gradient shaded luxury sun lenses.',
    features: ['Sculpted angular cat-eye curve', 'Gradient category-3 lenses', 'Gold leaf branding accents', 'Complimentary leather hard case'],
    dimensions: { lensWidth: 53, bridgeWidth: 18, templeLength: 140, frameWidth: 139 },
    colors: [
      { name: 'Piano Black', hex: '#09090B', image: '/images/category-sunglasses.jpg' },
      { name: 'Bordeaux Plum', hex: '#581C87', image: '/images/hero-banner.jpg' },
    ],
    recommendedFaceShapes: ['Round', 'Square', 'Diamond'],
  },
  {
    id: 'prod-005',
    name: 'The Kyoto Minimalist',
    slug: 'the-kyoto-minimalist',
    category: 'screen-glasses',
    categoryName: 'Screen Glasses',
    subCategory: 'unisex',
    frameShape: 'GEOMETRIC',
    frameMaterial: 'TITANIUM',
    frameType: 'RIMLESS',
    price: 4299,
    comparePrice: 5999,
    rating: 4.9,
    reviewCount: 63,
    badge: 'Ultralight',
    isBestseller: false,
    isTryOnAvailable: true,
    description: 'Weighing only 9.8 grams, the Kyoto rimless frame uses tension-mounted flexible beta-titanium designed for all-day digital comfort.',
    features: ['9.8g featherweight design', 'Zero-glare blue light filter (420nm cutoff)', 'Seamless screwless hinge mechanics', 'Medical silicone temple socks'],
    dimensions: { lensWidth: 50, bridgeWidth: 20, templeLength: 142, frameWidth: 136 },
    colors: [
      { name: 'Brushed Silver', hex: '#CBD5E1', image: '/images/category-men.jpg' },
      { name: 'Rose Gold', hex: '#FB7185', image: '/images/hero-banner.jpg' },
    ],
    recommendedFaceShapes: ['Oval', 'Round', 'Square', 'Oblong'],
  },
  {
    id: 'prod-006',
    name: 'The Riviera Sun Classic',
    slug: 'the-riviera-sun-classic',
    category: 'sunglasses',
    categoryName: 'Sunglasses',
    subCategory: 'unisex',
    frameShape: 'SQUARE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    price: 3699,
    comparePrice: 4799,
    rating: 4.8,
    reviewCount: 95,
    badge: 'Polarized',
    isBestseller: true,
    isTryOnAvailable: true,
    description: 'Timeless Mediterranean styling crafted from thick acetate with mineral glass green polarized lenses for unparalleled optical clarity.',
    features: ['High-contrast polarized mineral glass', 'Reinforced barrel hinges', 'Anti-reflective interior coating', 'Seawater & sweat resistant coating'],
    dimensions: { lensWidth: 51, bridgeWidth: 21, templeLength: 145, frameWidth: 142 },
    colors: [
      { name: 'Classic Havana', hex: '#522A0C', image: '/images/product-craft.jpg' },
      { name: 'Gloss Black', hex: '#000000', image: '/images/category-sunglasses.jpg' },
    ],
    recommendedFaceShapes: ['Round', 'Oval', 'Heart'],
  },
  {
    id: 'prod-007',
    name: 'The St. Germain Hexagon',
    slug: 'the-st-germain-hexagon',
    category: 'eyeglasses',
    categoryName: 'Eyeglasses',
    subCategory: 'women',
    frameShape: 'GEOMETRIC',
    frameMaterial: 'METAL',
    frameType: 'FULL_RIM',
    price: 3799,
    comparePrice: 5199,
    rating: 4.9,
    reviewCount: 52,
    badge: 'Artisan Crafted',
    isNew: true,
    isTryOnAvailable: true,
    description: 'Polygonal geometric silhouette crafted from surgical stainless steel with hand-enameled rim accents and micro-coin filigree edge engraving.',
    features: ['Geometric hexagonal geometry', 'Anti-reflective sapphire coating', 'Hypoallergenic silicone nose pads', 'Ultra-flexible temple tips'],
    dimensions: { lensWidth: 51, bridgeWidth: 19, templeLength: 142, frameWidth: 137 },
    colors: [
      { name: 'Champagne Rose', hex: '#E2A9A9', image: '/images/hero-banner.jpg' },
      { name: 'Brushed Gold', hex: '#C9A84C', image: '/images/category-sunglasses.jpg' },
      { name: 'Midnight Onyx', hex: '#18181B', image: '/images/category-men.jpg' },
    ],
    recommendedFaceShapes: ['Oval', 'Round', 'Heart'],
  },
  {
    id: 'prod-008',
    name: 'The Mayfair Clubmaster',
    slug: 'the-mayfair-clubmaster',
    category: 'reading-glasses',
    categoryName: 'Reading Glasses',
    subCategory: 'men',
    frameShape: 'RECTANGLE',
    frameMaterial: 'ACETATE',
    frameType: 'SEMI_RIMLESS',
    price: 3299,
    comparePrice: 4499,
    rating: 4.8,
    reviewCount: 88,
    badge: 'Near-Vision Precision',
    isBestseller: true,
    isTryOnAvailable: true,
    description: 'Sophisticated browline semi-rimless silhouette engineered specifically for crystal reading clarity, equipped with scratch-resistant aspheric reading optics.',
    features: ['Hand-finished Mazzucchelli acetate brow', 'High-tensile wire lower rim', 'Premium reading powers (+1.00 to +3.00)', 'Wide field-of-view lenses'],
    dimensions: { lensWidth: 50, bridgeWidth: 21, templeLength: 145, frameWidth: 141 },
    colors: [
      { name: 'Rich Tortoise & Gold', hex: '#653B18', image: '/images/product-craft.jpg' },
      { name: 'Matte Black & Gunmetal', hex: '#27272A', image: '/images/category-men.jpg' },
    ],
    recommendedFaceShapes: ['Round', 'Oval', 'Square'],
  },
];

export const CATEGORIES = [
  {
    id: 'cat-eyeglasses',
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'High-index prescription lenses & handcrafted designer frames',
    image: '/images/hero-banner.jpg',
    subcategories: ['Men', 'Women', 'Unisex', 'Kids', 'Titanium Collection', 'Zero Power'],
  },
  {
    id: 'cat-sunglasses',
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'Polarized 100% UV400 sun protection with runway silhouettes',
    image: '/images/category-sunglasses.jpg',
    subcategories: ['Aviators', 'Wayfarer', 'Cat-Eye', 'Polarized', 'Gradient'],
  },
  {
    id: 'cat-screen',
    name: 'Screen Glasses',
    slug: 'screen-glasses',
    description: 'Combat digital eye fatigue with precision blue-light filtering',
    image: '/images/category-men.jpg',
    subcategories: ['Zero Power', 'With Prescription', 'Ultralight TR90', 'Gamer Edition'],
  },
  {
    id: 'cat-reading',
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    description: 'Crystal-clear near vision reading lenses from +0.75 to +3.50',
    image: '/images/product-craft.jpg',
    subcategories: ['Foldable', 'Blue Light Reading', 'Slim Titanium'],
  },
];

export const FACE_SHAPES = [
  {
    shape: 'Oval',
    description: 'Balanced proportions with slightly wider cheekbones. Most versatile face shape.',
    recommendedFrames: ['Square', 'Round', 'Aviator', 'Geometric'],
    tips: 'Almost any frame works. Choose bold geometric or classic round for optimal contrast.',
  },
  {
    shape: 'Round',
    description: 'Equal width and length with softer angles and full cheeks.',
    recommendedFrames: ['Square', 'Rectangle', 'Cat-Eye'],
    tips: 'Angular and rectangular frames add structure and create an elongating silhouette.',
  },
  {
    shape: 'Square',
    description: 'Strong jawline with broad forehead and proportional angular features.',
    recommendedFrames: ['Round', 'Oval', 'Aviator'],
    tips: 'Rounded and curved frames soften angular features and balance strong jawlines.',
  },
  {
    shape: 'Heart',
    description: 'Broader forehead narrowing to a delicate pointed chin.',
    recommendedFrames: ['Round', 'Aviator', 'Rimless', 'Cat-Eye'],
    tips: 'Frames wider than forehead or bottom-heavy designs balance facial proportions gracefully.',
  },
  {
    shape: 'Diamond',
    description: 'Narrow forehead and jawline with dramatic, high cheekbones.',
    recommendedFrames: ['Cat-Eye', 'Oval', 'Rimless'],
    tips: 'Emphasize your high cheekbones with delicate rimless or upswept cat-eye silhouettes.',
  },
];

export const TRUST_PILLARS = [
  {
    icon: 'ShieldCheck',
    title: '1-Year Unconditional Warranty',
    description: 'Full coverage on manufacturing defects and frame structure.',
  },
  {
    icon: 'Sparkles',
    title: 'Precision German Lenses',
    description: 'Anti-reflective, scratch-resistant, hydrophobic and smudge-proof.',
  },
  {
    icon: 'Camera',
    title: 'Virtual 3D Try-On',
    description: 'Accurate scale fitting directly in your browser with camera.',
  },
  {
    icon: 'CalendarCheck',
    title: 'Certified Optometrist Test',
    description: 'Complimentary 20-step eye exam at our flagship stores or at home.',
  },
  {
    icon: 'RotateCcw',
    title: '14-Day Free Returns',
    description: 'No questions asked doorstep return and replacement guarantee.',
  },
];
