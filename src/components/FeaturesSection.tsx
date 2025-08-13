import { motion } from "framer-motion";
import { Mic, Globe, BarChart3, Smartphone, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice AI Capabilities",
    description: "Talk to Lexi naturally in English, Pidgin, Yoruba, or Igbo. She understands Nigerian context and responds intelligently.",
    gradient: "from-accent to-secondary"
  },
  {
    icon: Smartphone,
    title: "WhatsApp-Native Experience",
    description: "No apps to download. Works directly in WhatsApp Business. Send payments, track expenses, and manage finances via chat.",
    gradient: "from-whatsapp-green to-secondary"
  },
  {
    icon: BarChart3,
    title: "Business Analytics & Insights",
    description: "Get real-time insights on cash flow, spending patterns, and business performance. Automated financial reporting.",
    gradient: "from-success-gold to-accent"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "CBN compliant with 256-bit encryption. All transactions are secured and monitored for fraud protection.",
    gradient: "from-trust-blue to-secondary"
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Communicate in your preferred Nigerian language. Lexi adapts to your business terminology and local context.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: Zap,
    title: "Instant Payment Processing",
    description: "Send money, pay suppliers, and process transactions instantly. Direct integration with all major Nigerian banks.",
    gradient: "from-accent to-success-gold"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for Nigerian Business Finance
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Lexi combines the power of ChatGPT-5 with deep Nigerian financial expertise. 
            Built specifically for Nigerian businesses by Nigerian developers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:shadow-premium transition-all duration-300"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison with ChatGPT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">
              Why Lexi vs. Regular ChatGPT for Nigerian Business?
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-red-400 mb-4">❌ ChatGPT Limitations</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Can't process real payments</li>
                  <li>• No Nigerian bank integration</li>
                  <li>• Doesn't understand Naira context</li>
                  <li>• No local business compliance</li>
                  <li>• Limited Nigerian language support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-secondary mb-4">✅ LexiPay AI Advantages</h4>
                <ul className="space-y-2">
                  <li>• Real payment processing</li>
                  <li>• All Nigerian banks integrated</li>
                  <li>• Native Naira and business context</li>
                  <li>• CBN compliant and NDPR certified</li>
                  <li>• Fluent in Nigerian languages</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};