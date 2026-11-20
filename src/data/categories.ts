import { CategoryName } from '../types/jewellery';

export const MEN_SUBCATEGORIES = [
  'Bracelight(Kadiyam And Chain Model)',
  'Chains(Long And Short Chais)',
  'Rings',
] as const;

export const WOMEN_SUBCATEGORIES = [
  'Short Chains',
  'Long Chains',
  'Side Locket Thali Chains',
  'Suthralu',
  'Ear Rings',
  'Women Bracelights(Kadiyam And Chain Model)',
  'Rings',
  'Payals',
  'Haram Sets',
  'Nackles Sets',
  'Total Bridal Sets',
  'Hip Belts(Vaddanam(Plain And Heavy Models)',
  'All CZ Items',
  'Bangles',
  'Black Beads',
  'All Colour Beads',
  'Chandra Haram',
  'Pendent Sets',
  'Vankis',
  'Tikks',
  'Hair Accosaries',
  'Chempa Swaralu',
] as const;

export const WOMEN_MEGA_MENU_GROUPS: { title: string; items: string[] }[] = [
  {
    title: 'Chains & Daily Wear',
    items: [
      'Short Chains',
      'Long Chains',
      'Side Locket Thali Chains',
      'Suthralu',
      'Black Beads',
      'All Colour Beads',
    ],
  },
  {
    title: 'Harams & Bridal Sets',
    items: [
      'Haram Sets',
      'Nackles Sets',
      'Total Bridal Sets',
      'Chandra Haram',
      'Pendent Sets',
      'All CZ Items',
    ],
  },
  {
    title: 'Bangles, Hand & Waist',
    items: [
      'Bangles',
      'Women Bracelights(Kadiyam And Chain Model)',
      'Rings',
      'Vankis',
      'Hip Belts(Vaddanam(Plain And Heavy Models)',
      'Payals',
    ],
  },
  {
    title: 'Ears, Head & Hair',
    items: [
      'Ear Rings',
      'Tikks',
      'Hair Accosaries',
      'Chempa Swaralu',
    ],
  },
];

export const BRIDAL_SUBCATEGORIES = new Set<string>([
  'Total Bridal Sets',
  'Haram Sets',
  'Nackles Sets',
  'Hip Belts(Vaddanam(Plain And Heavy Models)',
  'Chandra Haram',
  'Vankis',
  'Tikks',
  'Hair Accosaries',
  'Chempa Swaralu',
]);

export interface FeaturedCategoryCard {
  id: string;
  label: string;
  category: CategoryName;
  subcategory: string;
  imageUrl: string;
  caption: string;
}

export const FEATURED_CATEGORY_CARDS: FeaturedCategoryCard[] = [
  {
    id: 'cat-bridal',
    label: 'Total Bridal Sets',
    category: 'WOMEN',
    subcategory: 'Total Bridal Sets',
    imageUrl: '/src/assets/images/hero_bridal_temple_1795165948267.jpg',
    caption: 'Complete Wedding Trousseau',
  },
  {
    id: 'cat-haram',
    label: 'Haram Sets',
    category: 'WOMEN',
    subcategory: 'Haram Sets',
    imageUrl: '/src/assets/images/hero_gold_harams_1795165947926.jpg',
    caption: 'Lakshmi & Temple Harams',
  },
  {
    id: 'cat-vaddanam',
    label: 'Vaddanam (Hip Belts)',
    category: 'WOMEN',
    subcategory: 'Hip Belts(Vaddanam(Plain And Heavy Models)',
    imageUrl: '/src/assets/images/product_vaddanam_hipbelt_1795165948081.jpg',
    caption: 'Plain & Heavy Bridal Belts',
  },
  {
    id: 'cat-choker',
    label: 'Nackles Sets',
    category: 'WOMEN',
    subcategory: 'Nackles Sets',
    imageUrl: '/src/assets/images/product_choker_jhumka_1795165948254.jpg',
    caption: 'Kemp & Matte Chokers',
  },
  {
    id: 'cat-bangles',
    label: 'Bangles & CZ Items',
    category: 'WOMEN',
    subcategory: 'Bangles',
    imageUrl: '/src/assets/images/product_bangles_cz_1795165948372.jpg',
    caption: 'Gold Matte & AD Stones',
  },
  {
    id: 'cat-black-beads',
    label: 'Black Beads',
    category: 'WOMEN',
    subcategory: 'Black Beads',
    imageUrl: '/src/assets/images/hero_daily_chains_1795165948556.jpg',
    caption: 'Daily Mangalsutra Chains',
  },
  {
    id: 'cat-hair-acc',
    label: 'Hair Accosaries',
    category: 'WOMEN',
    subcategory: 'Hair Accosaries',
    imageUrl: '/src/assets/images/product_hair_bridal_acc_1795165948386.jpg',
    caption: 'Jada Billalu & Vankis',
  },
  {
    id: 'cat-mens-chains',
    label: "Men's Chains & Kadiyam",
    category: 'MEN',
    subcategory: 'Chains(Long And Short Chais)',
    imageUrl: '/src/assets/images/product_mens_gold_set_1795165948597.jpg',
    caption: 'Lotus Links & Solid Kadiyams',
  },
];

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl: string;
  filterCategory: CategoryName | 'ALL';
  filterSubcategory: string;
  filterTab: 'ALL' | 'MEN' | 'WOMEN' | 'BRIDAL' | 'NEW_ARRIVALS';
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-bridal',
    eyebrow: 'Bridal Muhurtham Collection',
    title: 'Royal 1-Gram Gold Temple Bridal Sets',
    subtitle:
      'Handcrafted Lakshmi harams, kemp chokers, and heirloom vaddanams finished in rich micro-gold plating.',
    ctaLabel: 'Shop Bridal Collection',
    imageUrl: '/src/assets/images/hero_bridal_temple_1795165948267.jpg',
    filterCategory: 'WOMEN',
    filterSubcategory: '',
    filterTab: 'BRIDAL',
  },
  {
    id: 'slide-harams',
    eyebrow: 'Signature Heritage Craft',
    title: 'Antique Matte Harams & Chandra Harams',
    subtitle:
      'Direct-from-workshop 1-gram gold covering necklaces sculpted with South Indian temple artistry.',
    ctaLabel: 'Explore Haram Sets',
    imageUrl: '/src/assets/images/hero_gold_harams_1795165947926.jpg',
    filterCategory: 'WOMEN',
    filterSubcategory: 'Haram Sets',
    filterTab: 'WOMEN',
  },
  {
    id: 'slide-daily',
    eyebrow: 'Everyday Grace & Durability',
    title: 'Daily Wear Black Beads & Thali Chains',
    subtitle:
      'Skin-friendly, tarnish-resistant black bead chains, side locket thali chains, and gold-finished everyday chains.',
    ctaLabel: 'Shop Daily Wear Chains',
    imageUrl: '/src/assets/images/hero_daily_chains_1795165948556.jpg',
    filterCategory: 'WOMEN',
    filterSubcategory: 'Black Beads',
    filterTab: 'WOMEN',
  },
];
