import { HeroSection } from "./HeroSection";
import { TrustSection } from "./TrustSection";
import { UseCasesSection } from "./UseCasesSection";
import { SecuritySection } from "./SecuritySection";
import { ContextAwareSection } from "./ContextAwareSection";
import { FeaturesSection } from "./FeaturesSection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <TrustSection />
      <UseCasesSection />
      <SecuritySection />
      <ContextAwareSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};