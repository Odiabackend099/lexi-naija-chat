import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { HeroSection } from "./HeroSection";
import { TrustSection } from "./TrustSection";
import { UseCasesSection } from "./UseCasesSection";
import { SecuritySection } from "./SecuritySection";
import { ContextAwareSection } from "./ContextAwareSection";
import { ParallaxContainer } from "./ParallaxContainer";
import { FeaturesSection } from "./FeaturesSection";
import { CEOSection } from "./CEOSection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { Footer } from "./Footer";
import VoiceChatWidget from "./VoiceChatWidget";

export const LandingPage = () => {
  const { user, signOut } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-accent origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* User Menu */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-card/95 backdrop-blur-sm border rounded-lg p-2">
            <div className="flex items-center gap-2 px-3 py-1">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {user.email?.split('@')[0]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <HeroSection />
      
      {/* Voice Chat Demo */}
      <section id="demo" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Experience Voice AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Talk naturally with Lexi using our continuous voice conversation technology - 
              no buttons to press, just speak and listen.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <VoiceChatWidget />
          </div>
        </div>
      </section>
      
      {/* Parallax Sections */}
      <ParallaxContainer speed={0.2}>
        <FeaturesSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.1}>
        <UseCasesSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.3}>
        <TrustSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.15}>
        <SecuritySection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.25}>
        <ContextAwareSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.1}>
        <CEOSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.2}>
        <PricingSection />
      </ParallaxContainer>
      
      <ParallaxContainer speed={0.1}>
        <FAQSection />
      </ParallaxContainer>
      
      <Footer />
    </div>
  );
};