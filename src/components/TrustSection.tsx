import { motion } from "framer-motion";
import { Shield, Lock, Award, CheckCircle } from "lucide-react";

const trustSignals = [
  {
    icon: Shield,
    title: "CBN Compliant",
    description: "Central Bank of Nigeria certified financial services"
  },
  {
    icon: Lock,
    title: "NDPR Certified",
    description: "Nigerian Data Protection Regulation compliant"
  },
  {
    icon: Award,
    title: "Bank Grade Security",
    description: "256-bit encryption for all transactions"
  },
  {
    icon: CheckCircle,
    title: "ODIA.Dev Powered",
    description: "Built by Nigeria's leading AI development team"
  }
];

const nigerianBanks = [
  "GTBank", "First Bank", "UBA", "Zenith Bank", "Access Bank", "Fidelity Bank"
];

export const TrustSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Nigerian Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for Nigeria, compliant with Nigerian regulations, integrated with Nigerian banks
          </p>
        </motion.div>

        {/* Trust Signals */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass p-6 rounded-2xl text-center"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <signal.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{signal.title}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bank Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold mb-8">
            Integrated with Nigeria's Top Banks
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {nigerianBanks.map((bank, index) => (
              <motion.div
                key={bank}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="px-6 py-3 bg-card border border-border rounded-lg text-lg font-medium"
              >
                {bank}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};