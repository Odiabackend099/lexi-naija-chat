import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { whatsappLauncher } from '@/lib/whatsapp';
import { useErrorHandler } from '@/components/ui/ErrorBoundary';
import { toast } from '@/hooks/use-toast';

interface WhatsAppCTAProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'inline' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  messageTemplate?: 'trial' | 'demo' | 'support' | 'upgrade' | 'pricing' | 'business' | 'technical';
  customMessage?: string;
  context?: string;
  businessType?: string;
  specificNeed?: string;
  className?: string;
  disabled?: boolean;
  showIcon?: boolean;
  trackAnalytics?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  variant = 'primary',
  size = 'md',
  text,
  messageTemplate = 'trial',
  customMessage,
  context,
  businessType,
  specificNeed,
  className = '',
  disabled = false,
  showIcon = true,
  trackAnalytics = true,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { handleError } = useErrorHandler();

  // Get appropriate text based on variant and template
  const getButtonText = () => {
    if (text) return text;
    
    switch (messageTemplate) {
      case 'trial':
        return 'Start Free Trial in WhatsApp';
      case 'demo':
        return 'See Live Demo';
      case 'support':
        return 'Get Help on WhatsApp';
      case 'upgrade':
        return 'Upgrade via WhatsApp';
      case 'pricing':
        return 'Ask About Pricing';
      case 'business':
        return 'Contact Business Team';
      case 'technical':
        return 'Technical Support';
      default:
        return 'Chat on WhatsApp';
    }
  };

  // Get appropriate message
  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (messageTemplate === 'business' && (businessType || specificNeed)) {
      return whatsappLauncher.createBusinessMessage(businessType, specificNeed);
    }
    
    return whatsappLauncher.getMessageTemplate(messageTemplate);
  };

  // Handle WhatsApp launch
  const handleLaunch = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      const message = getMessage();
      const launchContext = context || `${messageTemplate}_cta`;
      
      const result = await whatsappLauncher.launch({
        message,
        context: launchContext,
        trackAnalytics
      });

      if (result.success) {
        setIsSuccess(true);
        
        // Show success feedback
        toast({
          title: "Opening WhatsApp...",
          description: `Launching ${result.method === 'app' ? 'WhatsApp app' : 'WhatsApp Web'}`,
          variant: "default",
        });

        // Call success callback
        onSuccess?.();
        
        // Reset success state after animation
        setTimeout(() => setIsSuccess(false), 2000);
        
      } else {
        throw new Error(result.error || 'Failed to open WhatsApp');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open WhatsApp';
      
      handleError(error as Error, 'WhatsApp CTA');
      
      toast({
        title: "WhatsApp Launch Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError?.(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Get button variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-whatsapp-green hover:bg-whatsapp-green/90 text-white shadow-lg hover:shadow-glow';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
      case 'outline':
        return 'border-2 border-whatsapp-green text-whatsapp-green hover:bg-whatsapp-green hover:text-white';
      case 'inline':
        return 'bg-transparent text-whatsapp-green hover:text-whatsapp-green/80 p-0 h-auto';
      case 'floating':
        return 'bg-whatsapp-green hover:bg-whatsapp-green/90 text-white shadow-premium fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0';
      default:
        return 'bg-whatsapp-green hover:bg-whatsapp-green/90 text-white';
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    if (variant === 'floating') return '';
    
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3';
    }
  };

  const buttonText = getButtonText();
  const isInline = variant === 'inline';
  const isFloating = variant === 'floating';

  const ButtonContent = () => (
    <>
      {showIcon && !isFloating && (
        <motion.div
          animate={isLoading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
        >
          {isSuccess ? (
            <Check className="w-4 h-4" />
          ) : isLoading ? (
            <ExternalLink className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
        </motion.div>
      )}
      
      {isFloating ? (
        <MessageCircle className="w-6 h-6" />
      ) : (
        <span>{buttonText}</span>
      )}
    </>
  );

  if (isInline) {
    return (
      <button
        onClick={handleLaunch}
        disabled={disabled || isLoading}
        className={`inline-flex items-center gap-2 font-medium transition-colors duration-200 ${getVariantStyles()} ${className}`}
        aria-label={buttonText}
      >
        <ButtonContent />
      </button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={isFloating ? '' : 'inline-block'}
    >
      <Button
        onClick={handleLaunch}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center gap-2 font-semibold transition-all duration-300
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        aria-label={buttonText}
      >
        <ButtonContent />
      </Button>
    </motion.div>
  );
};

// Pre-configured CTA components for common use cases
export const TrialCTA = (props: Omit<WhatsAppCTAProps, 'messageTemplate'>) => (
  <WhatsAppCTA messageTemplate="trial" {...props} />
);

export const DemoCTA = (props: Omit<WhatsAppCTAProps, 'messageTemplate'>) => (
  <WhatsAppCTA messageTemplate="demo" {...props} />
);

export const SupportCTA = (props: Omit<WhatsAppCTAProps, 'messageTemplate'>) => (
  <WhatsAppCTA messageTemplate="support" {...props} />
);

export const FloatingWhatsAppCTA = () => (
  <WhatsAppCTA
    variant="floating"
    messageTemplate="support"
    context="floating_cta"
    text="Contact Support"
  />
);

// Business inquiry CTA with business type selection
interface BusinessCTAProps extends Omit<WhatsAppCTAProps, 'messageTemplate' | 'businessType'> {
  businessType?: 'restaurant' | 'retail' | 'services' | 'ecommerce' | 'manufacturing' | 'other';
}

export const BusinessCTA: React.FC<BusinessCTAProps> = ({ businessType, ...props }) => (
  <WhatsAppCTA
    messageTemplate="business"
    businessType={businessType}
    {...props}
  />
);

export default WhatsAppCTA;