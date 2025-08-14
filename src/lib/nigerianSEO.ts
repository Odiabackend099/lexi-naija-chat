// SEO and performance optimization utilities for Nigerian market

// Nigerian-focused long-tail keywords for content optimization
export const NIGERIAN_KEYWORDS = {
  // Financial services
  financial: [
    'AI financial assistant Nigeria',
    'WhatsApp banking Nigeria 2025',
    'Nigerian business mobile banking',
    'CBN approved fintech Nigeria',
    'send money WhatsApp Nigeria',
    'check bank balance WhatsApp',
    'Nigerian AI chatbot banking',
    'Lagos fintech AI assistant',
    'Abuja mobile banking AI',
    'Nigerian business financial AI'
  ],
  
  // Competitor analysis
  competitive: [
    'better than Opay Nigeria',
    'Palmpay alternative Nigeria',
    'Kuda bank AI alternative',
    'GTBank USSD alternative',
    'FirstBank mobile alternative',
    'Access bank app alternative',
    'UBA mobile banking alternative',
    'Zenith bank AI assistant'
  ],
  
  // Local banking
  banking: [
    'Nigerian bank integration AI',
    'all Nigerian banks WhatsApp',
    'CBN compliant AI banking',
    'Nigerian naira AI payments',
    'Lagos business banking AI',
    'Nigerian SME banking solution',
    'African fintech AI assistant',
    'Nigerian digital transformation'
  ],
  
  // Voice and language
  voice: [
    'Nigerian English AI assistant',
    'Yoruba banking AI',
    'Hausa financial AI',
    'Igbo money transfer AI',
    'Nigerian pidgin banking',
    'African voice AI banking',
    'Nigeria local language fintech'
  ]
};

// Generate meta titles optimized for Nigerian search behavior
export const generateNigerianMetaTitle = (page: string, location?: string): string => {
  const baseTitle = 'LexiPay AI';
  const tagline = "Nigeria's #1 AI Financial Assistant";
  const cta = 'Start Free Trial';
  
  const templates = {
    home: `${baseTitle} - ${tagline} | CBN Compliant WhatsApp Banking`,
    features: `AI Banking Features - ${baseTitle} | ${location ? `${location} ` : ''}Nigerian Fintech`,
    pricing: `Pricing - ${baseTitle} | Affordable AI Banking for Nigerian Businesses`,
    about: `About ${baseTitle} by ODIA.Dev | Nigerian AI Financial Technology`,
    demo: `Live Demo - ${baseTitle} | See AI Banking in Action | ${cta}`,
    trial: `Free Trial - ${baseTitle} | 7 Days Free | Nigerian AI Banking`,
    support: `Support - ${baseTitle} | Help Center | Nigerian WhatsApp Banking`
  };
  
  return templates[page as keyof typeof templates] || `${baseTitle} - ${tagline}`;
};

// Generate meta descriptions optimized for Nigerian users
export const generateNigerianMetaDescription = (page: string): string => {
  const descriptions = {
    home: 'ChatGPT-5 class AI financial assistant for Nigerian businesses. Send money via WhatsApp, check balances, pay bills. CBN compliant, works with all Nigerian banks. Start 7-day free trial.',
    
    features: 'Discover LexiPay AI features: WhatsApp banking, voice commands in Nigerian English, CBN compliance, instant transfers, bill payments, account management for Nigerian businesses.',
    
    pricing: 'Affordable AI banking for Nigerian SMEs. Starting ₦5,000/month. No setup fees, 7-day free trial. CBN compliant, works with GTBank, UBA, FirstBank, Access Bank, Zenith Bank.',
    
    about: 'LexiPay AI by ODIA.Dev - Nigeria\'s leading Voice AI company. Building the future of African fintech with AI assistants that understand Nigerian business needs.',
    
    demo: 'See LexiPay AI in action. Watch how Nigerian businesses use our AI assistant for WhatsApp banking, payments, and financial management. Start your free demo today.',
    
    trial: 'Start your 7-day free trial of LexiPay AI. Full access to Nigerian AI banking features. No credit card required. CBN compliant. Cancel anytime.',
    
    support: 'Get help with LexiPay AI. Nigerian customer support via WhatsApp. Setup assistance, troubleshooting, and training for your business team.'
  };
  
  return descriptions[page as keyof typeof descriptions] || descriptions.home;
};

// Nigerian business schema markup generator
export const generateNigerianBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "LexiPay AI",
    "alternateName": "LexiPay Nigerian AI Financial Assistant",
    "description": "AI-powered financial assistant for Nigerian businesses",
    "url": "https://lexipay.odia.dev",
    "logo": "https://lexipay.odia.dev/logo-nigeria.png",
    "image": "https://lexipay.odia.dev/og-image-nigeria.png",
    
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressRegion": "Lagos State",
      "addressLocality": "Lagos"
    },
    
    "areaServed": [
      {
        "@type": "Country",
        "name": "Nigeria"
      },
      {
        "@type": "State",
        "name": "Lagos State"
      },
      {
        "@type": "State", 
        "name": "Abuja FCT"
      },
      {
        "@type": "State",
        "name": "Rivers State"
      }
    ],
    
    "serviceType": [
      "Digital Banking",
      "AI Financial Assistant", 
      "Mobile Payments",
      "Business Banking",
      "WhatsApp Banking"
    ],
    
    "priceRange": "₦₦",
    "paymentAccepted": ["Nigerian Naira", "Bank Transfer", "Mobile Money"],
    
    "openingHours": "Mo-Su 00:00-23:59",
    "telephone": "+234-810-578-6326",
    "email": "support@odia.dev",
    
    "sameAs": [
      "https://twitter.com/ODIADev",
      "https://linkedin.com/company/odia-dev",
      "https://instagram.com/odia.dev"
    ],
    
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "LexiPay AI Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Financial Assistant"
          },
          "price": "5000",
          "priceCurrency": "NGN",
          "availability": "https://schema.org/InStock"
        }
      ]
    },
    
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Adebayo Lagos Business Owner"
        },
        "reviewBody": "LexiPay AI revolutionized our restaurant's payment system. WhatsApp integration is perfect for Nigerian customers."
      }
    ],
    
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250",
      "bestRating": "5"
    }
  };
};

// Nigerian location-based SEO data
export const NIGERIAN_LOCATIONS = {
  states: [
    { name: 'Lagos', keywords: ['Lagos fintech', 'Lagos AI banking', 'Victoria Island banking'] },
    { name: 'Abuja', keywords: ['Abuja fintech', 'FCT digital banking', 'Abuja business banking'] },
    { name: 'Rivers', keywords: ['Port Harcourt fintech', 'Rivers State banking', 'PH business banking'] },
    { name: 'Kano', keywords: ['Kano digital banking', 'Northern Nigeria fintech'] },
    { name: 'Oyo', keywords: ['Ibadan fintech', 'Oyo State banking'] },
    { name: 'Edo', keywords: ['Benin City banking', 'Edo State fintech'] }
  ],
  
  cities: [
    'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City',
    'Kaduna', 'Jos', 'Ilorin', 'Aba', 'Enugu', 'Warri', 'Calabar'
  ],
  
  business_districts: [
    'Victoria Island', 'Ikoyi', 'Lekki', 'Ikeja', 'Surulere',
    'Wuse 2', 'Garki', 'Asokoro', 'Trans Amadi', 'GRA Port Harcourt'
  ]
};

// SEO-optimized content templates for Nigerian market
export const NIGERIAN_CONTENT_TEMPLATES = {
  hero: {
    headlines: [
      'Nigeria\'s First ChatGPT-5 Class AI Financial Assistant',
      'Imagine Having a Personal AI Banker on WhatsApp',
      'The Smart Way Nigerian Businesses Handle Money',
      'AI Banking That Actually Works in Nigeria'
    ],
    
    subheadlines: [
      'Send money, check balances, pay bills via WhatsApp. CBN compliant with all Nigerian banks.',
      'Built specifically for Nigerian businesses. Works with MTN, Airtel, Glo networks.',
      'From Lagos to Abuja, Nigerian entrepreneurs trust LexiPay AI for smart banking.',
      'Join 2,000+ Nigerian businesses using AI for smarter financial decisions.'
    ]
  },
  
  features: {
    whatsapp: 'Banking on WhatsApp - Nigeria\'s favorite messaging app',
    voice: 'Voice commands in Nigerian English, Yoruba, Hausa, and Igbo',
    compliance: 'CBN compliant and approved by Nigerian banking regulations',
    banks: 'Works with GTBank, UBA, FirstBank, Access, Zenith, and 20+ Nigerian banks'
  },
  
  social_proof: [
    'Trusted by Lagos restaurants for instant payments',
    'Port Harcourt oil companies use our AI for expense tracking', 
    'Abuja tech startups automate invoicing with LexiPay AI',
    'Kano traders send money to suppliers via WhatsApp',
    'Ibadan manufacturers track cash flow with voice commands'
  ]
};

// Performance optimization for Nigerian networks
export const NIGERIAN_PERFORMANCE_CONFIG = {
  // Image optimization for slow networks
  imageQuality: {
    '2g': 40,
    'slow-2g': 30,
    '3g': 70,
    '4g': 85
  },
  
  // Critical resource loading strategy
  criticalResources: [
    '/src/main.tsx',
    '/src/index.css',
    '/android-chrome-192x192.png'
  ],
  
  // Lazy loading offsets for Nigerian users
  lazyLoadOffset: '200px',
  
  // Timeout settings for Nigerian networks
  timeouts: {
    api: 10000,      // 10 seconds for API calls
    image: 8000,     // 8 seconds for images
    font: 5000       // 5 seconds for fonts
  }
};

// Local storage optimization for offline functionality
export const NIGERIAN_OFFLINE_CONFIG = {
  // Cache duration in milliseconds
  cacheDuration: {
    staticAssets: 7 * 24 * 60 * 60 * 1000,  // 7 days
    apiResponses: 60 * 60 * 1000,            // 1 hour
    userPreferences: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  
  // Priority caching for Nigerian users
  priorityCache: [
    'exchange-rates',
    'bank-details',
    'transaction-history',
    'whatsapp-templates'
  ],
  
  // Offline messages in Nigerian context
  offlineMessages: {
    noConnection: 'No internet connection. Please check your MTN/Airtel/Glo network.',
    slowConnection: 'Network is slow. LexiPay AI is optimized for Nigerian networks.',
    offlineMode: 'You\'re offline. Recent transactions are saved and will sync when connected.'
  }
};