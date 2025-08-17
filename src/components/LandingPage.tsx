import { motion, useScroll, useSpring } from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-accent origin-left z-50"
        style={{ scaleX }}
      />
      
      <HeroSection />
      
      {/* Voice Chat Demo */}
      <section className="py-16 bg-muted/20">
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