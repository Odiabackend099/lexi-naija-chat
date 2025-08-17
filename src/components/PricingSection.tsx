import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  {
    name: "Starter",
    price: "₦5,000",
    period: "per month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 100 transactions/month",
      "WhatsApp integration",
      "Basic analytics",
      "Payment processing",
      "Email support"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Business",
    price: "₦15,000",
    period: "per month",
    description: "Ideal for growing Nigerian businesses",
    features: [
      "Up to 1,000 transactions/month",
      "Advanced analytics",
      "Multi-language support",
      "Priority support",
      "Custom integrations",
      "Voice AI responses"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "₦50,000",
    period: "per month",
    description: "For large businesses and corporations",
    features: [
      "Unlimited transactions",
      "White-label solution",
      "Dedicated account manager",
      "Custom AI training",
      "24/7 phone support",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export const PricingSection = () => {
  const handleWhatsAppCTA = () => {
    window.open("https://wa.me/14155238886?text=Hi%20Lexi!%20I%20want%20to%20try%20LexiPay%20AI%20for%20my%20business.%20Please%20set%20me%20up.", "_blank");
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 7-day free trial. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.popular 
                  ? "border-secondary bg-gradient-to-b from-secondary/10 to-background shadow-glow" 
                  : "border-border bg-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleWhatsAppCTA}
                className={`w-full ${
                  tier.popular 
                    ? "bg-secondary hover:bg-secondary/90" 
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="lg"
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            All plans include 7-day free trial • No setup fees • Cancel anytime
          </p>
          <p className="text-sm text-muted-foreground">
            Need enterprise features? <button className="text-secondary hover:underline">Contact our team</button>
          </p>
        </motion.div>
      </div>
    </section>
  );
};