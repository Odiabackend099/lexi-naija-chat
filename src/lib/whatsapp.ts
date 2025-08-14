// Smart WhatsApp integration with Nigerian mobile optimization
interface WhatsAppOptions {
  phoneNumber?: string;
  message: string;
  context?: string;
  trackAnalytics?: boolean;
}

interface WhatsAppResponse {
  success: boolean;
  method?: 'app' | 'web' | 'download';
  error?: string;
}

class WhatsAppLauncher {
  private defaultPhoneNumber = '2348105786326'; // LexiPay AI Support
  private businessName = 'LexiPay AI Support';

  // Message templates for different scenarios
  private messageTemplates = {
    trial: "Hi Lexi! I want to try LexiPay AI for my business. Please set me up with a 7-day free trial.",
    demo: "Hi Lexi! I saw the demo on the website. Can you show me how payments work?",
    support: "Hi! I need help with LexiPay AI. Can you assist me?",
    upgrade: "Hi! I'm interested in upgrading to the full ODIA.Dev business automation suite.",
    pricing: "Hi! I'd like to know more about LexiPay AI pricing and features.",
    business: "Hi! I'm a Nigerian business owner interested in AI financial assistance.",
    technical: "Hi! I have technical questions about LexiPay AI integration."
  };

  // Detect device type for optimal WhatsApp experience
  private detectDevice(): 'ios' | 'android' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'desktop';
  }

  // Check if WhatsApp app is likely installed
  private async checkWhatsAppInstalled(): Promise<boolean> {
    const device = this.detectDevice();
    
    // On desktop, assume WhatsApp Desktop might be installed
    if (device === 'desktop') return true;
    
    // On mobile, we can't reliably detect app installation
    // We'll attempt app launch and fallback to web
    return true;
  }

  // Format phone number for WhatsApp
  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Ensure it starts with country code
    if (cleaned.startsWith('0')) {
      return '234' + cleaned.slice(1);
    }
    
    if (!cleaned.startsWith('234')) {
      return '234' + cleaned;
    }
    
    return cleaned;
  }

  // Generate WhatsApp URLs for different methods
  private generateUrls(phoneNumber: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    
    return {
      app: `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`,
      web: `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`,
      api: `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
    };
  }

  // Track WhatsApp launches for analytics
  private trackLaunch(context: string, method: string) {
    try {
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('whatsapp_launched', {
          context,
          method,
          timestamp: new Date().toISOString(),
          device: this.detectDevice(),
          userAgent: navigator.userAgent
        });
      }
    } catch (error) {
      console.warn('Failed to track WhatsApp launch:', error);
    }
  }

  // Main launch method with intelligent fallbacks
  async launch(options: WhatsAppOptions): Promise<WhatsAppResponse> {
    const {
      phoneNumber = this.defaultPhoneNumber,
      message,
      context = 'general',
      trackAnalytics = true
    } = options;

    try {
      const device = this.detectDevice();
      const urls = this.generateUrls(phoneNumber, message);
      
      if (trackAnalytics) {
        this.trackLaunch(context, 'attempt');
      }

      // Mobile strategy: Try app first, then fallback to web
      if (device === 'ios' || device === 'android') {
        return await this.launchMobile(urls, context, trackAnalytics);
      }
      
      // Desktop strategy: Use web interface
      return await this.launchDesktop(urls, context, trackAnalytics);
      
    } catch (error) {
      console.error('WhatsApp launch failed:', error);
      return {
        success: false,
        error: 'Failed to open WhatsApp. Please try again or contact support directly.'
      };
    }
  }

  // Mobile-specific launch strategy
  private async launchMobile(
    urls: ReturnType<typeof this.generateUrls>, 
    context: string, 
    trackAnalytics: boolean
  ): Promise<WhatsAppResponse> {
    
    // Try to open WhatsApp app
    try {
      window.location.href = urls.app;
      
      // Wait to see if app opened successfully
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is still on our page (app didn't open)
      if (document.hasFocus()) {
        // App didn't open, try web version
        window.open(urls.api, '_blank', 'noopener,noreferrer');
        
        if (trackAnalytics) {
          this.trackLaunch(context, 'web_fallback');
        }
        
        return {
          success: true,
          method: 'web'
        };
      }
      
      if (trackAnalytics) {
        this.trackLaunch(context, 'app');
      }
      
      return {
        success: true,
        method: 'app'
      };
      
    } catch (error) {
      // If app launch fails, open web version
      window.open(urls.api, '_blank', 'noopener,noreferrer');
      
      if (trackAnalytics) {
        this.trackLaunch(context, 'web_error_fallback');
      }
      
      return {
        success: true,
        method: 'web'
      };
    }
  }

  // Desktop-specific launch strategy
  private async launchDesktop(
    urls: ReturnType<typeof this.generateUrls>, 
    context: string, 
    trackAnalytics: boolean
  ): Promise<WhatsAppResponse> {
    
    // On desktop, use web.whatsapp.com
    const newWindow = window.open(urls.web, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      return {
        success: false,
        error: 'Pop-up blocked. Please allow pop-ups and try again.'
      };
    }
    
    if (trackAnalytics) {
      this.trackLaunch(context, 'web');
    }
    
    return {
      success: true,
      method: 'web'
    };
  }

  // Get pre-defined message template
  getMessageTemplate(template: keyof typeof this.messageTemplates): string {
    return this.messageTemplates[template] || this.messageTemplates.support;
  }

  // Create custom message with Nigerian business context
  createBusinessMessage(businessType?: string, specificNeed?: string): string {
    let message = "Hi Lexi! I'm a Nigerian business owner";
    
    if (businessType) {
      message += ` running a ${businessType}`;
    }
    
    message += " and I'm interested in LexiPay AI.";
    
    if (specificNeed) {
      message += ` I specifically need help with ${specificNeed}.`;
    }
    
    message += " Can you help me get started?";
    
    return message;
  }

  // Validate Nigerian phone number
  validateNigerianPhone(phone: string): { valid: boolean; error?: string } {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      return { valid: false, error: 'Phone number is required' };
    }
    
    // Nigerian mobile numbers are 11 digits (starting with 0) or 13 digits (with country code)
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return { valid: true };
    }
    
    if (cleaned.length === 13 && cleaned.startsWith('234')) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      error: 'Please enter a valid Nigerian phone number (e.g., 08012345678)' 
    };
  }
}

// Export singleton instance
export const whatsappLauncher = new WhatsAppLauncher();

// Convenience functions for common use cases
export const WhatsAppHelpers = {
  startTrial: () => whatsappLauncher.launch({
    message: whatsappLauncher.getMessageTemplate('trial'),
    context: 'trial_signup'
  }),

  requestDemo: () => whatsappLauncher.launch({
    message: whatsappLauncher.getMessageTemplate('demo'),
    context: 'demo_request'
  }),

  getSupport: () => whatsappLauncher.launch({
    message: whatsappLauncher.getMessageTemplate('support'),
    context: 'support_request'
  }),

  askAboutPricing: () => whatsappLauncher.launch({
    message: whatsappLauncher.getMessageTemplate('pricing'),
    context: 'pricing_inquiry'
  }),

  businessInquiry: (businessType?: string, specificNeed?: string) => 
    whatsappLauncher.launch({
      message: whatsappLauncher.createBusinessMessage(businessType, specificNeed),
      context: 'business_inquiry'
    })
};