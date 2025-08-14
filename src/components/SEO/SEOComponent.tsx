import React from 'react';
import { motion } from 'framer-motion';

interface SEOComponentProps {
  page?: 'home' | 'features' | 'pricing' | 'about';
  title?: string;
  description?: string;
  keywords?: string[];
}

export const SEOComponent: React.FC<SEOComponentProps> = ({ 
  page = 'home',
  title,
  description,
  keywords = []
}) => {
  React.useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
    
    // Update keywords
    if (keywords.length > 0) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '));
      }
    }
    
    // Add structured data for current page
    addPageStructuredData(page);
    
  }, [page, title, description, keywords]);
  
  return null;
};

function addPageStructuredData(page: string) {
  // Remove existing structured data
  const existingScript = document.querySelector('#page-structured-data');
  if (existingScript) {
    existingScript.remove();
  }
  
  let structuredData;
  
  switch (page) {
    case 'home':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "LexiPay AI - Nigeria's #1 AI Financial Assistant",
        "description": "ChatGPT-5 class AI financial assistant for Nigerian businesses",
        "url": "https://lexipay.odia.dev",
        "mainEntity": {
          "@type": "SoftwareApplication",
          "name": "LexiPay AI",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NGN",
            "description": "7-day free trial"
          }
        }
      };
      break;
      
    case 'features':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "LexiPay AI Features",
        "description": "AI financial assistant features for Nigerian businesses",
        "itemListElement": [
          {
            "@type": "SoftwareFeature",
            "name": "WhatsApp Integration",
            "description": "Send money and check balances via WhatsApp"
          },
          {
            "@type": "SoftwareFeature", 
            "name": "Voice AI",
            "description": "Voice commands in Nigerian English and local languages"
          },
          {
            "@type": "SoftwareFeature",
            "name": "CBN Compliance",
            "description": "Fully compliant with Nigerian banking regulations"
          }
        ]
      };
      break;
      
    case 'pricing':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "PriceSpecification",
        "name": "LexiPay AI Pricing",
        "price": "5000",
        "priceCurrency": "NGN",
        "billingIncrement": "P1M",
        "description": "Monthly subscription for Nigerian businesses"
      };
      break;
      
    default:
      return;
  }
  
  // Add structured data to page
  const script = document.createElement('script');
  script.id = 'page-structured-data';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Nigerian SEO Keywords Database
export const NIGERIAN_SEO_KEYWORDS = {
  primary: [
    'AI financial assistant Nigeria',
    'WhatsApp banking Nigeria', 
    'Nigerian fintech AI',
    'mobile money Nigeria',
    'CBN compliant fintech',
    'Nigerian business banking',
    'digital payments Nigeria'
  ],
  
  location: [
    'fintech Lagos',
    'AI payments Abuja', 
    'mobile banking Port Harcourt',
    'digital money Kano',
    'fintech Ibadan',
    'AI banking Benin City'
  ],
  
  competitor: [
    'better than Opay',
    'alternative to Palmpay',
    'smarter than Kuda',
    'faster than GTBank app',
    'easier than FirstBank USSD'
  ],
  
  local: [
    'send money Nigeria',
    'check account balance',
    'pay bills Nigeria',
    'transfer money WhatsApp',
    'Nigerian naira payments',
    'Lagos business banking'
  ]
};

// Performance optimization for Nigerian networks
export const optimizeForNigerianNetworks = () => {
  // Lazy load images below the fold
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Preload critical resources for next page
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/features';
  document.head.appendChild(link);
  
  // Optimize for slow Nigerian networks
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
      // Disable non-critical animations
      document.documentElement.style.setProperty('--animation-duration', '0s');
      
      // Use lower quality images
      document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('?')) {
          img.src += '&quality=60';
        } else {
          img.src += '?quality=60';
        }
      });
    }
  }
};

export default SEOComponent;