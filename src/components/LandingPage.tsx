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
import TalkButton from "./TalkButton";

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
      
      {/* ODIA TTS Demo */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Try ODIA Voice AI</h2>
          <TalkButton />
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