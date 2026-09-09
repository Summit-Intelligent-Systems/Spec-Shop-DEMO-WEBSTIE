/**
 * XYZ Eyewear — Authoritative Knowledge Base for RAG
 * Derived strictly from website resources:
 * - apps/web/src/lib/mockData.ts (Products, Categories, Face Shapes, Trust Pillars)
 * - apps/web/src/app/stores/page.tsx (Flagship Optical Boutiques)
 * - apps/web/src/components/home/EyeCareBanner.tsx (20-Step Complimentary Eye Exam)
 * - apps/web/src/components/prescription/PrescriptionConfigurator.tsx (Vision Types, Lens Packages/Indices, Coatings)
 * - apps/web/src/components/product/FrameGeometryGuide.tsx (Technical Blueprint & Fit Guide)
 * - apps/web/src/components/3d/CraftStorySection.tsx (Italian Acetate, Titanium, 5-Barrel Hinges, Sapphire Coating)
 * - apps/web/src/components/layout/Footer.tsx (Warranty, 14-day Returns, Free Shipping, Promo Code LUXE15, Support)
 */

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'product' | 'store' | 'face-shape' | 'lens-technology' | 'policy' | 'service' | 'craftsmanship';
  url: string;
  content: string;
  tags: string[];
}

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  // ─── 1. Products Catalog ───────────────────────────────────────────────────
  {
    id: 'prod-001',
    title: 'The Sovereign Round (Eyeglasses)',
    category: 'product',
    url: '/product/the-sovereign-round',
    content: `Product: The Sovereign Round
Category: Eyeglasses (Unisex)
Price: ₹3,499 (Regular ₹4,999)
Frame Shape: Round | Frame Type: Full Rim | Material: Hand-polished Japanese & Italian Mazzucchelli Acetate
Rating: 4.9/5 (142 reviews) | Status: Bestseller
Description: Precision-milled from premium 8mm organic Mazzucchelli acetate with custom wirecore filigree and 5-barrel custom hinges.
Features: Hand-polished Japanese acetate, Anti-reflective sapphire coating, Hypoallergenic titanium nose pads, Scratch-resistant blue filter option.
Dimensions: Lens width: 49mm, Bridge width: 20mm, Temple length: 145mm, Total frame width: 138mm.
Colors: Dark Amber Tortoise (#633B18), Obsidian Black (#111111), Crystal Slate (#94A3B8).
Recommended Face Shapes: Square, Oval, Heart.
Virtual 3D Try-On: Available.`,
    tags: ['sovereign', 'round', 'acetate', 'eyeglasses', 'bestseller', 'unisex', '3499'],
  },
  {
    id: 'prod-002',
    title: 'The Aviator Prime (Sunglasses)',
    category: 'product',
    url: '/product/the-aviator-prime',
    content: `Product: The Aviator Prime
Category: Sunglasses (Unisex)
Price: ₹4,999 (Regular ₹6,999)
Frame Shape: Aviator | Frame Type: Full Rim | Material: Grade-5 Pure Aerospace Titanium (weighs only 14 grams)
Rating: 4.8/5 (89 reviews) | Status: Polarized UV400 Bestseller
Description: Ultralight Japanese aerospace-grade titanium frame with polarized CR-39 sun lenses offering 100% UVA/UVB blockage.
Features: Grade-5 pure titanium (14 grams), Polarized UV400 lenses, Oleophobic smudge resistant, Laser-etched logo detailing.
Dimensions: Lens width: 55mm, Bridge width: 17mm, Temple length: 140mm, Total frame width: 142mm.
Colors: Champagne Gold (#C9A84C), Brushed Gunmetal (#475569).
Recommended Face Shapes: Oval, Square, Heart.
Virtual 3D Try-On: Available.`,
    tags: ['aviator', 'prime', 'titanium', 'sunglasses', 'polarized', 'uv400', '4999', 'ultralight'],
  },
  {
    id: 'prod-003',
    title: 'The Kensington Square (Eyeglasses)',
    category: 'product',
    url: '/product/the-kensington-square',
    content: `Product: The Kensington Square
Category: Eyeglasses (Men)
Price: ₹2,999 (Regular ₹3,999)
Frame Shape: Square | Frame Type: Full Rim | Material: Bevel-cut Acetate with Brushed Gold Wirecore
Rating: 4.7/5 (114 reviews) | Status: Trending, New Arrival
Description: A sharp architectural silhouette featuring bevel-cut acetate rims and brushed gold core wire for a distinguished executive aesthetic.
Features: Beveled browline styling, German engineered spring hinges, Weight balanced temples, Available with digital screen protection.
Dimensions: Lens width: 52mm, Bridge width: 19mm, Temple length: 145mm, Total frame width: 140mm.
Colors: Matte Charcoal (#27272A), Tortoise Shell (#78350F).
Recommended Face Shapes: Round, Oval.
Virtual 3D Try-On: Available.`,
    tags: ['kensington', 'square', 'acetate', 'eyeglasses', 'men', 'trending', '2999'],
  },
  {
    id: 'prod-004',
    title: 'The Marais Cat-Eye (Sunglasses)',
    category: 'product',
    url: '/product/the-marais-cat-eye',
    content: `Product: The Marais Cat-Eye
Category: Sunglasses (Women)
Price: ₹3,999 (Regular ₹5,499)
Frame Shape: Cat-Eye | Frame Type: Full Rim | Material: Sculpted Acetate
Rating: 5.0/5 (76 reviews) | Status: Limited Edition, New Arrival
Description: An audacious feminine silhouette inspired by mid-century Parisian haute couture, enhanced with gradient shaded luxury sun lenses.
Features: Sculpted angular cat-eye curve, Gradient category-3 lenses, Gold leaf branding accents, Complimentary leather hard case.
Dimensions: Lens width: 53mm, Bridge width: 18mm, Temple length: 140mm, Total frame width: 139mm.
Colors: Piano Black (#09090B), Bordeaux Plum (#581C87).
Recommended Face Shapes: Round, Square, Diamond.
Virtual 3D Try-On: Available.`,
    tags: ['marais', 'cat-eye', 'sunglasses', 'women', 'limited edition', '3999'],
  },
  {
    id: 'prod-005',
    title: 'The Kyoto Minimalist (Screen Glasses)',
    category: 'product',
    url: '/product/the-kyoto-minimalist',
    content: `Product: The Kyoto Minimalist
Category: Screen Glasses / Computer Blue Light Glasses (Unisex)
Price: ₹4,299 (Regular ₹5,999)
Frame Shape: Geometric | Frame Type: Rimless | Material: Flexible Beta-Titanium
Rating: 4.9/5 (63 reviews) | Status: Ultralight Featherweight
Description: Weighing only 9.8 grams, the Kyoto rimless frame uses tension-mounted flexible beta-titanium designed for all-day digital comfort.
Features: 9.8g featherweight design, Zero-glare blue light filter (420nm cutoff), Seamless screwless hinge mechanics, Medical silicone temple socks.
Dimensions: Lens width: 50mm, Bridge width: 20mm, Temple length: 142mm, Total frame width: 136mm.
Colors: Brushed Silver (#CBD5E1), Rose Gold (#FB7185).
Recommended Face Shapes: Oval, Round, Square, Oblong.
Virtual 3D Try-On: Available.`,
    tags: ['kyoto', 'minimalist', 'screen-glasses', 'blue light', 'rimless', 'titanium', 'featherweight', '4299'],
  },
  {
    id: 'prod-006',
    title: 'The Riviera Sun Classic (Sunglasses)',
    category: 'product',
    url: '/product/the-riviera-sun-classic',
    content: `Product: The Riviera Sun Classic
Category: Sunglasses (Unisex)
Price: ₹3,699 (Regular ₹4,799)
Frame Shape: Square | Frame Type: Full Rim | Material: Thick Italian Acetate & Mineral Glass
Rating: 4.8/5 (95 reviews) | Status: Polarized Bestseller
Description: Timeless Mediterranean styling crafted from thick acetate with mineral glass green polarized lenses for unparalleled optical clarity.
Features: High-contrast polarized mineral glass, Reinforced barrel hinges, Anti-reflective interior coating, Seawater & sweat resistant coating.
Dimensions: Lens width: 51mm, Bridge width: 21mm, Temple length: 145mm, Total frame width: 142mm.
Colors: Classic Havana (#522A0C), Gloss Black (#000000).
Recommended Face Shapes: Round, Oval, Heart.
Virtual 3D Try-On: Available.`,
    tags: ['riviera', 'sun', 'classic', 'sunglasses', 'polarized', 'mineral glass', 'acetate', '3699'],
  },
  {
    id: 'prod-007',
    title: 'The St. Germain Hexagon (Eyeglasses)',
    category: 'product',
    url: '/product/the-st-germain-hexagon',
    content: `Product: The St. Germain Hexagon
Category: Eyeglasses (Women)
Price: ₹3,799 (Regular ₹5,199)
Frame Shape: Geometric Hexagonal | Frame Type: Full Rim | Material: Surgical Stainless Steel
Rating: 4.9/5 (52 reviews) | Status: Artisan Crafted, New
Description: Polygonal geometric silhouette crafted from surgical stainless steel with hand-enameled rim accents and micro-coin filigree edge engraving.
Features: Geometric hexagonal geometry, Anti-reflective sapphire coating, Hypoallergenic silicone nose pads, Ultra-flexible temple tips.
Dimensions: Lens width: 51mm, Bridge width: 19mm, Temple length: 142mm, Total frame width: 137mm.
Colors: Champagne Rose (#E2A9A9), Brushed Gold (#C9A84C), Midnight Onyx (#18181B).
Recommended Face Shapes: Oval, Round, Heart.
Virtual 3D Try-On: Available.`,
    tags: ['st germain', 'hexagon', 'geometric', 'metal', 'eyeglasses', 'women', '3799'],
  },
  {
    id: 'prod-008',
    title: 'The Mayfair Clubmaster (Reading Glasses)',
    category: 'product',
    url: '/product/the-mayfair-clubmaster',
    content: `Product: The Mayfair Clubmaster
Category: Reading Glasses (Men)
Price: ₹3,299 (Regular ₹4,499)
Frame Shape: Rectangle Browline | Frame Type: Semi-Rimless | Material: Mazzucchelli Acetate & High-tensile Wire
Rating: 4.8/5 (88 reviews) | Status: Near-Vision Precision Bestseller
Description: Sophisticated browline semi-rimless silhouette engineered specifically for crystal reading clarity, equipped with scratch-resistant aspheric reading optics.
Features: Hand-finished Mazzucchelli acetate brow, High-tensile wire lower rim, Premium reading powers (+1.00 to +3.00), Wide field-of-view lenses.
Dimensions: Lens width: 50mm, Bridge width: 21mm, Temple length: 145mm, Total frame width: 141mm.
Colors: Rich Tortoise & Gold (#653B18), Matte Black & Gunmetal (#27272A).
Recommended Face Shapes: Round, Oval, Square.
Virtual 3D Try-On: Available.`,
    tags: ['mayfair', 'clubmaster', 'reading glasses', 'semi-rimless', 'men', '3299'],
  },

  // ─── 2. Categories & Collections ──────────────────────────────────────────
  {
    id: 'cat-all',
    title: 'Eyewear Collections & Categories Overview',
    category: 'product',
    url: '/shop',
    content: `XYZ Eyewear Collections:
1. Eyeglasses (/shop/eyeglasses): High-index prescription lenses & handcrafted designer frames in Japanese titanium and Italian acetate. Subcategories: Men, Women, Unisex, Kids, Titanium Collection, Zero Power.
2. Sunglasses (/shop/sunglasses): Polarized 100% UV400 sun protection with runway silhouettes. Subcategories: Aviators, Wayfarer, Cat-Eye, Polarized, Gradient.
3. Screen Glasses (/shop/screen-glasses): Combat digital eye fatigue with precision 420nm blue-light filtering. Subcategories: Zero Power, With Prescription, Ultralight TR90, Gamer Edition.
4. Reading Glasses (/shop/reading-glasses): Crystal-clear near vision reading lenses from +0.75 to +3.50. Subcategories: Foldable, Blue Light Reading, Slim Titanium.`,
    tags: ['categories', 'collections', 'eyeglasses', 'sunglasses', 'screen glasses', 'reading glasses'],
  },

  // ─── 3. Face Shape Matching Guide ──────────────────────────────────────────
  {
    id: 'face-shape-guide',
    title: 'Face Shape Guide & Frame Recommendations',
    category: 'face-shape',
    url: '/face-shape-guide',
    content: `Face Shape Frame Matching Guide:
1. Oval Face Shape:
- Description: Balanced proportions with slightly wider cheekbones. Most versatile face shape.
- Recommended Frames: Square, Round, Aviator, Geometric (e.g., The Sovereign Round, The Kensington Square, The Aviator Prime).
- Styling Tip: Almost any frame works. Choose bold geometric or classic round for optimal contrast.

2. Round Face Shape:
- Description: Equal width and length with softer angles and full cheeks.
- Recommended Frames: Square, Rectangle, Cat-Eye (e.g., The Kensington Square, The Marais Cat-Eye, The Mayfair Clubmaster).
- Styling Tip: Angular and rectangular frames add structure, create contrast, and visually elongate the face. Avoid perfectly round circular frames.

3. Square Face Shape:
- Description: Strong jawline with broad forehead and proportional angular features.
- Recommended Frames: Round, Oval, Aviator (e.g., The Sovereign Round, The Aviator Prime).
- Styling Tip: Rounded and curved frames soften angular features and balance strong jawlines gracefully.

4. Heart Face Shape:
- Description: Broader forehead narrowing down to a delicate, pointed chin.
- Recommended Frames: Round, Aviator, Rimless, Cat-Eye (e.g., The Sovereign Round, The Aviator Prime, The Kyoto Minimalist).
- Styling Tip: Frames wider than the forehead or bottom-heavy/rimless designs balance facial proportions.

5. Diamond Face Shape:
- Description: Narrow forehead and jawline with dramatic, high cheekbones.
- Recommended Frames: Cat-Eye, Oval, Rimless (e.g., The Marais Cat-Eye, The Kyoto Minimalist).
- Styling Tip: Emphasize high cheekbones with delicate rimless or upswept cat-eye silhouettes.`,
    tags: ['face shape', 'round face', 'square face', 'oval face', 'heart face', 'diamond face', 'styling tips', 'guide'],
  },

  // ─── 4. Frame Sizing & Measurement Guide ───────────────────────────────────
  {
    id: 'frame-sizing-guide',
    title: 'Frame Dimensions, Geometry Blueprint & Bank Card Sizing Method',
    category: 'lens-technology',
    url: '/prescription-guide',
    content: `Technical Optical Blueprint & Frame Sizing Guide:
- Lens Width: The horizontal diameter of one lens (e.g., 49mm to 55mm).
- Bridge Width: The distance between the two lenses over the bridge of your nose (e.g., 17mm to 21mm).
- Temple Arm Length: Total length of the side temple piece (e.g., 140mm to 145mm).
- Total Frame Width: Hinge-to-hinge front width across the face (e.g., 136mm to 142mm).

Standard Bank Card Sizing Trick:
Stand in front of a mirror and place any standard credit/bank card vertically against the center bridge of your nose:
1. If the outer edge of the card extends past the outer corner of your eye: You have a Small / Narrow face.
2. If the card aligns directly with the outer corner of your eye: You have a Medium face (Standard fit for our frames).
3. If the card ends before reaching the outer corner of your eye: Choose a Large / Wide frame.`,
    tags: ['dimensions', 'frame size', 'credit card sizing', 'lens width', 'bridge width', 'temple length', 'measurements'],
  },

  // ─── 5. Prescription Types, Lens Packages & Coatings ──────────────────────
  {
    id: 'prescription-optics',
    title: 'Prescription Types, Lens Indices & Coating Options',
    category: 'lens-technology',
    url: '/prescription-guide',
    content: `Prescription Options, Lens Indices and Protective Coatings at XYZ Eyewear:

Vision Types Available:
1. Zero Power / Digital Screen (₹0 extra): Complete blue-light & UV400 defense for digital screen users without corrective power.
2. Single Vision (₹999 extra): For myopia (distance), hyperopia (near reading), or astigmatism correction.
3. Progressive / Multifocal (₹2,499 extra): Seamless no-line transition between distance, computer, and reading zones.
4. Polarized Sun Prescription (₹1,999 extra): Prescription sun lenses with 100% glare elimination and rich color contrast.

Lens Thickness & High-Index Packages:
1. Standard Clarity 1.50 Index (₹0 included): Ideal for powers up to ±2.00. Impact resistant CR-39 with 100% UV protection.
2. High-Index Thin 1.60 Index (₹999): Ideal for powers up to ±4.00. 25% thinner & lighter, aspheric flat profile, high tensile durability.
3. Ultra-Thin Aspheric 1.67 Index (₹1,999): Ideal for powers up to ±7.00. 40% thinner than standard, ultra-crisp peripheral vision, featherweight.
4. Featherweight 1.74 High Index (₹3,499): Ideal for high powers ±7.00 and above. 55% thinner than standard, zero edge distortion, thinnest organic lens available.

Advanced Optical Coatings:
1. Sapphire Anti-Glare & Hydrophobic (₹0 Included Free): Eliminates 99.8% of reflections, repels water, dust, and fingerprint smudges.
2. Blue Defense 420nm Shield (₹799): Blocks high-energy blue-violet light emitted by OLED screens, monitors, and LED lights.
3. Photochromic Transitions Gen-8 (₹1,999): Crystal clear indoors; rapidly turns dark sunglasses tint under outdoor sunlight.
4. DriveSafe Night Contrast Coating (₹1,299): Reduces blinding headlight glare and enhances road contrast during nighttime driving.

Prescription Submission Methods:
You can enter prescription values manually (SPH, CYL, Axis, Add, PD), upload a photo of your doctor's prescription slip, or select "Submit Later" after checkout.`,
    tags: ['prescription', 'lenses', 'lens index', '1.60', '1.67', '1.74', 'coatings', 'blue light', 'transitions', 'progressive'],
  },

  // ─── 6. Eye Care Examination & Clinic Protocol ────────────────────────────
  {
    id: 'eye-care-clinic',
    title: 'Clinical 20-Step Eye Examination (100% Complimentary)',
    category: 'service',
    url: '/book-eye-test',
    content: `XYZ Clinical Eye Examination:
- 100% Complimentary: Our comprehensive 20-step computerized eye examination is completely free of charge.
- 20-Step Certified Protocol: Includes automated corneal topography, digital refraction, intraocular pressure screening, and retina wellness check performed by certified optometrists.
- Zero-Error Guarantee: Prescriptions are backed by our zero-error accuracy guarantee.
- Two Testing Options:
  1. In-Store Flagship Salons: Enjoy a private optometry suite, complimentary beverage, and 1-on-1 styling consultation. Available 7 days a week.
  2. Doorstep Home Eye Test: Certified optometrist visits your home or office equipped with portable digital testing equipment and 100+ trial frames.
- Track Record: Over 120,000+ verified prescriptions delivered.
- Booking: Bookable directly on the website (/book-eye-test or via the Eye Care banner).`,
    tags: ['eye exam', 'eye test', 'free eye test', 'optometrist', '20-step', 'home visit', 'clinic', 'complimentary'],
  },

  // ─── 7. Flagship Optical Boutiques & Stores ────────────────────────────────
  {
    id: 'stores-network',
    title: 'Flagship Optical Stores & Locations',
    category: 'store',
    url: '/stores',
    content: `XYZ Flagship Optical Boutiques & Store Locations:

1. Bengaluru Boutique (Flagship):
- Name: Indiranagar Flagship Boutique
- Address: 42, 100ft Road, Indiranagar, Stage 2, Bengaluru, Karnataka 560038
- Phone: +91 80 4123 4567 | Email: indiranagar@xyz-eyewear.com
- Hours: 10:00 AM – 9:00 PM (Mon–Sat) • 11:00 AM – 7:00 PM (Sun)
- Services: Comprehensive 20-Step Eye Exam, Virtual Try-On Suite, Bespoke Engraving, Home Delivery, Frame Adjustment
- Rating: 4.9/5

2. Mumbai Boutique:
- Name: Linking Road Maison
- Address: 17, Linking Road, Bandra West, Mumbai, Maharashtra 400050
- Phone: +91 22 2655 1234 | Email: bandra@xyz-eyewear.com
- Hours: 10:30 AM – 9:30 PM (All Days)
- Services: Eye Exam, Contact Lens Fitting, Lens Replacement, Insurance Claims
- Rating: 4.7/5

3. New Delhi Studio (Flagship):
- Name: Khan Market Studio
- Address: Shop 34, Middle Lane, Khan Market, New Delhi, Delhi 110003
- Phone: +91 11 2461 7890 | Email: khanmarket@xyz-eyewear.com
- Hours: 11:00 AM – 8:30 PM (Mon–Sat) • Closed on Sundays
- Services: Comprehensive Eye Exam, Titanium Collection Showcase, Express Lens Lab
- Rating: 4.8/5

4. Hyderabad Lounge:
- Name: Jubilee Hills Optical Lounge
- Address: Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
- Phone: +91 40 2354 5678 | Email: jubileehills@xyz-eyewear.com
- Hours: 10:00 AM – 8:00 PM (All Days)
- Services: Eye Exam, Sunglasses Bar, Kids Eyewear Corner
- Rating: 4.6/5`,
    tags: ['stores', 'locations', 'bengaluru', 'mumbai', 'delhi', 'hyderabad', 'indiranagar', 'bandra', 'khan market', 'jubilee hills', 'timings', 'phone'],
  },

  // ─── 8. Materials, Engineering & Craftsmanship ────────────────────────────
  {
    id: 'craftsmanship-materials',
    title: 'Materials, Metallurgy & Master Craftsmanship',
    category: 'craftsmanship',
    url: '/lens-technology',
    content: `XYZ Eyewear Materials and Engineering Standards:
1. Italian Mazzucchelli Acetate:
- Sourced exclusively from the historic Mazzucchelli workshop in Castiglione Olona, Italy.
- Made from organic cotton-based cellulose acetate.
- Hand-polished over 48 hours for luminous depth of color, warm skin feel, and durable structural integrity.

2. Pure Japanese Titanium:
- Grade-5 aerospace titanium and beta-titanium sourced from Sabae, Fukui, Japan.
- Weighs as little as 9.8g (The Kyoto Minimalist) and 14g (The Aviator Prime).
- Hypoallergenic, corrosion-proof, sweat-resistant, and flexible memory metal.

3. 5-Barrel Hinge Mechanism:
- CNC-milled from surgical stainless steel.
- Tested and rated for 60,000+ open-close cycles without loosening.
- Micro-tension screws ensure smooth, calibrated resistance.

4. 7-Layer Nano-Coating Stack:
- Applied under vacuum deposition: anti-reflective, oleophobic (fingerprint resistant), hydrophobic (water repelling), UV400 blocker, blue-light filter, anti-static, and sapphire hardness scratch-proof top coat.

5. 27-Point Quality Inspection:
- Every finished frame undergoes a 27-point inspection by certified master opticians. Lens seating, temple alignment, and hinge tension are verified to ±0.1mm tolerance.`,
    tags: ['materials', 'acetate', 'titanium', 'hinges', 'craftsmanship', 'mazzucchelli', 'japan', 'quality', 'engineering'],
  },

  // ─── 9. Warranty, Returns, Shipping & Discounts ────────────────────────────
  {
    id: 'store-policies-warranty',
    title: 'Warranty, Return Policy, Shipping Charges & Promo Codes',
    category: 'policy',
    url: '/faq',
    content: `XYZ Eyewear Store Policies, Guarantees and Offers:

1. 1-Year Unconditional Warranty:
- Full 1-year coverage against any manufacturing defects and frame structural issues on all acetate and titanium frames.
- Free repair or replacement at any flagship store or via doorstep courier pickup.

2. 14-Day Free Returns & Doorstep Exchanges:
- No questions asked 14-day doorstep return and replacement guarantee.
- 100% full refund to original payment method. Courier picks up from your address.

3. Shipping Rates & Delivery:
- Free express shipping on all orders over ₹999.
- Flat shipping charge of ₹99 on orders under ₹999.
- Delivery timeline: 2 to 4 business days in metro cities, 3 to 6 business days across other locations.

4. Exclusive Discount Promo Code:
- Promo Code: "LUXE15"
- Benefit: 15% discount on your first frame purchase when joining the XYZ Private Salon.

5. Tax & Pricing Transparency:
- All prices displayed are inclusive of 18% GST. No hidden fees at checkout.

6. Customer Support Concierge:
- Phone: +91 98765 43210
- Email: support@xyzeyewear.com
- Available 7 days a week, 9:00 AM to 9:00 PM IST.`,
    tags: ['warranty', 'returns', 'shipping', 'discount', 'promo code', 'luxe15', '14 days', '1 year', 'support', 'gst'],
  },

  // ─── 10. Virtual 3D Try-On & Face Shape Camera ────────────────────────────
  {
    id: 'virtual-tryon-tech',
    title: 'Virtual 3D Try-On & Digital Camera Fitting',
    category: 'service',
    url: '/try-on',
    content: `Virtual 3D Try-On Suite:
- Real-time 3D camera try-on directly inside your web browser with zero app installation.
- Utilizes face landmark tracking and true millimeter scale to render frames accurately on your face.
- Lighting simulation: Test frames under natural daylight, studio lighting, and evening ambient light.
- Supported on all modern mobile and desktop browsers with camera permissions.
- Available on all bestselling models including The Sovereign Round, The Aviator Prime, The Kensington Square, The Marais Cat-Eye, and The Kyoto Minimalist.`,
    tags: ['virtual try on', 'vto', 'camera', '3d try-on', 'augmented reality', 'fit'],
  },
];
