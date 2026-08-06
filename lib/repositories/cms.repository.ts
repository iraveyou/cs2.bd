export interface HeroBannerConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bgImageUrl: string;
  badgeText: string;
  promoTag: string;
  isEnabled: boolean;
}

export interface FeaturedListingConfig {
  id: string;
  title: string;
  skin: string;
  price: number;
  image: string;
  tag: 'FLASH SALE' | 'TRENDING' | 'HOT DEAL' | 'RARE';
  floatValue: number;
}

export interface FeaturedSellerConfig {
  id: string;
  name: string;
  handle: string;
  salesCount: number;
  rating: number;
  badge: string;
  avatar: string;
}

export interface AnnouncementConfig {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  type: 'INFO' | 'PROMO' | 'WARNING';
  isActive: boolean;
}

export interface BlogPostConfig {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  isPublished: boolean;
  views: number;
}

export interface FAQItemConfig {
  id: string;
  category: 'Buyer' | 'Seller' | 'Payment & bKash' | 'Disputes';
  question: string;
  answer: string;
}

export interface SEOSettingsConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
  googleMerchantId: string;
  canonicalDomain: string;
  sitemapEnabled: boolean;
}

export interface NavigationItemConfig {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface FooterColumnConfig {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

export interface AdPromotionConfig {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  bannerImageUrl: string;
  bannerPosition: 'HOMEPAGE_HERO' | 'MARKETPLACE_SIDEBAR' | 'LISTING_TOP';
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
}

export interface CMSState {
  hero: HeroBannerConfig;
  featuredListings: FeaturedListingConfig[];
  featuredSellers: FeaturedSellerConfig[];
  announcements: AnnouncementConfig[];
  blogs: BlogPostConfig[];
  faqs: FAQItemConfig[];
  seo: SEOSettingsConfig;
  navLinks: NavigationItemConfig[];
  footerColumns: FooterColumnConfig[];
  promotions: AdPromotionConfig[];
}

// Initial CMS Default Data
let cmsData: CMSState = {
  hero: {
    title: 'Bangladesh’s Premier Counter-Strike 2 Marketplace',
    subtitle: 'Buy & sell CS2 skins with instant bKash, Nagad & Rocket manual Escrow verification. 100% verified Bangladeshi sellers.',
    ctaText: 'Explore Skins',
    ctaLink: '/marketplace',
    secondaryCtaText: 'Become a Seller',
    secondaryCtaLink: '/seller/dashboard',
    bgImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    badgeText: '0% ESCROW FEE FOR VERIFIED TRADERS',
    promoTag: 'CS2 MAJOR BD SPECIAL 2026',
    isEnabled: true,
  },
  featuredListings: [
    {
      id: 'list-1',
      title: 'AK-47 | Asiimov',
      skin: 'Factory New',
      price: 18500,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      tag: 'FLASH SALE',
      floatValue: 0.0412,
    },
    {
      id: 'list-2',
      title: 'Butterfly Knife | Fade',
      skin: 'Factory New',
      price: 185000,
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
      tag: 'RARE',
      floatValue: 0.0105,
    },
    {
      id: 'list-3',
      title: 'AWP | Dragon Lore',
      skin: 'Field-Tested',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      tag: 'HOT DEAL',
      floatValue: 0.1822,
    },
  ],
  featuredSellers: [
    {
      id: 'sel-1',
      name: 'DhakaSkinVault',
      handle: '@dhakaskinvault',
      salesCount: 1420,
      rating: 4.9,
      badge: 'PRO SELLER',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dhakaskinvault',
    },
    {
      id: 'sel-2',
      name: 'CS2 Bangladesh Official',
      handle: '@cs2bd_store',
      salesCount: 890,
      rating: 5.0,
      badge: 'VERIFIED MERCHANT',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cs2bd_store',
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      message: '⚡ Instant bKash & Nagad Cashout active 24/7! All trades secured by cs2bd Escrow.',
      linkText: 'Learn Escrow Flow',
      linkUrl: '/faq',
      type: 'PROMO',
      isActive: true,
    },
  ],
  blogs: [
    {
      id: 'blog-1',
      slug: 'cs2-skin-trading-guide-bangladesh-2026',
      title: 'Ultimate Guide to CS2 Skin Trading in Bangladesh (2026)',
      category: 'Trading Guides',
      excerpt: 'Learn how to buy and sell CS2 knives, gloves, and covert skins safely in BD using bKash and cs2bd Escrow.',
      content: 'Counter-Strike 2 skin trading in Bangladesh has grown rapidly...',
      author: 'Admin Team',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      publishedAt: '2026-08-01',
      isPublished: true,
      views: 1240,
    },
    {
      id: 'blog-2',
      slug: 'avoid-steam-api-key-scams-bd',
      title: 'How to Prevent Steam API Key Scams & Fake Trade Offers',
      category: 'Security',
      excerpt: 'Protect your Steam inventory from API scams, phishing links, and fake middleman Facebook groups.',
      content: 'Steam API key scams remain the #1 threat for skin traders...',
      author: 'Cybersecurity Desk',
      coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      publishedAt: '2026-07-28',
      isPublished: true,
      views: 2890,
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      category: 'Payment & bKash',
      question: 'How does manual bKash/Nagad verification work on cs2bd?',
      answer: 'After selecting an item and clicking Buy, you receive the seller’s verified Merchant/Personal Send Money number. You submit the Transaction ID (TrxID) and sender number. Our Admin team audits the transaction and releases the item to your Steam trade URL.',
    },
    {
      id: 'faq-2',
      category: 'Buyer',
      question: 'What if a seller doesn’t send the CS2 skin on Steam?',
      answer: 'Your money is held safely in cs2bd Escrow. If the seller fails to deliver within the specified delivery window (e.g. 15 mins), you receive a 100% instant refund.',
    },
  ],
  seo: {
    siteTitle: 'cs2bd — #1 CS2 Skins Marketplace in Bangladesh',
    metaDescription: 'Buy and sell Counter-Strike 2 skins, knives, gloves & cases in Bangladesh. Secured with bKash/Nagad manual Escrow, verified sellers, and instant delivery.',
    keywords: 'CS2 skins Bangladesh, buy CS2 skins bKash, CS2 knives BD, CSGO marketplace Bangladesh, cs2bd skins',
    ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@cs2bd.bd',
    googleMerchantId: 'GMC-BD-99201',
    canonicalDomain: 'https://cs2bd.com.bd',
    sitemapEnabled: true,
  },
  navLinks: [
    { id: 'nav-1', label: 'Marketplace', href: '/marketplace', badge: 'LIVE' },
    { id: 'nav-2', label: 'Categories', href: '/categories' },
    { id: 'nav-3', label: 'Blog & News', href: '/blog' },
    { id: 'nav-4', label: 'Become a Seller', href: '/seller/dashboard', badge: 'HOT' },
  ],
  footerColumns: [
    {
      id: 'foot-1',
      title: 'Marketplace',
      links: [
        { label: 'All CS2 Skins', href: '/marketplace' },
        { label: 'Knives & Gloves', href: '/categories' },
        { label: 'Top Sellers', href: '/marketplace?filter=top_sellers' },
        { label: 'Deals & Sales', href: '/marketplace?filter=deals' },
      ],
    },
    {
      id: 'foot-2',
      title: 'Support & Trust',
      links: [
        { label: 'Escrow Security', href: '/faq' },
        { label: 'Contact Support', href: '/contact' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  promotions: [
    {
      id: 'promo-1',
      code: 'CS2BD2026',
      title: 'BD Major Launch Promo Code',
      discountPercent: 5,
      bannerImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80',
      bannerPosition: 'HOMEPAGE_HERO',
      maxUses: 500,
      usedCount: 142,
      isActive: true,
      expiryDate: '2026-12-31',
    },
  ],
};

export class CMSRepository {
  static getCMSData(): CMSState {
    return cmsData;
  }

  static updateHeroBanner(hero: HeroBannerConfig): HeroBannerConfig {
    cmsData.hero = { ...cmsData.hero, ...hero };
    return cmsData.hero;
  }

  static addBlogPost(post: Omit<BlogPostConfig, 'id' | 'views'>): BlogPostConfig {
    const newPost: BlogPostConfig = {
      ...post,
      id: `blog-${Date.now()}`,
      views: 0,
    };
    cmsData.blogs.unshift(newPost);
    return newPost;
  }

  static updateBlogPost(id: string, updates: Partial<BlogPostConfig>): BlogPostConfig | null {
    const idx = cmsData.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    cmsData.blogs[idx] = { ...cmsData.blogs[idx], ...updates };
    return cmsData.blogs[idx];
  }

  static deleteBlogPost(id: string): boolean {
    const len = cmsData.blogs.length;
    cmsData.blogs = cmsData.blogs.filter((b) => b.id !== id);
    return cmsData.blogs.length < len;
  }

  static addFAQ(faq: Omit<FAQItemConfig, 'id'>): FAQItemConfig {
    const newFaq: FAQItemConfig = {
      ...faq,
      id: `faq-${Date.now()}`,
    };
    cmsData.faqs.push(newFaq);
    return newFaq;
  }

  static deleteFAQ(id: string): boolean {
    const len = cmsData.faqs.length;
    cmsData.faqs = cmsData.faqs.filter((f) => f.id !== id);
    return cmsData.faqs.length < len;
  }

  static updateSEO(seo: SEOSettingsConfig): SEOSettingsConfig {
    cmsData.seo = { ...cmsData.seo, ...seo };
    return cmsData.seo;
  }

  static addPromotion(promo: Omit<AdPromotionConfig, 'id' | 'usedCount'>): AdPromotionConfig {
    const newPromo: AdPromotionConfig = {
      ...promo,
      id: `promo-${Date.now()}`,
      usedCount: 0,
    };
    cmsData.promotions.unshift(newPromo);
    return newPromo;
  }

  static deletePromotion(id: string): boolean {
    const len = cmsData.promotions.length;
    cmsData.promotions = cmsData.promotions.filter((p) => p.id !== id);
    return cmsData.promotions.length < len;
  }

  static updateAnnouncements(announcements: AnnouncementConfig[]): AnnouncementConfig[] {
    cmsData.announcements = announcements;
    return cmsData.announcements;
  }

  static saveFullCMSState(newState: CMSState): CMSState {
    cmsData = { ...newState };
    return cmsData;
  }
}
