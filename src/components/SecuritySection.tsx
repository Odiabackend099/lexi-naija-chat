import { motion } from "framer-motion";
import { Shield, Lock, Eye } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "PIN for Every Payment",
    description: "Every payment through Lexi is protected by a PIN you create during setup. You're in control set custom limits for when your PIN is required.",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Lock,
    title: "Private Chat Lock for Lexi",
    description: "Secure your Lexi chat by hiding it in a locked folder. Only you can access it using your phone's password or biometric ID.",
    color: "from-green-500 to-blue-500"
  },
  {
    icon: Eye,
    title: "Biometric Login for Extra Safety",
    description: "Your Lexi activity is protected by your phone's unlock. Want even more privacy? Lock individual conversation with a single tap.",
    color: "from-red-500 to-pink-500"
  }
];

export const SecuritySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Secured with WhatsApp's Built-In Privacy Protections
          </motion.h2>
        </div>

        {/* Security Features */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto mb-8 w-24 h-24"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className={`relative w-full h-full bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [-5, 5, -5],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full opacity-60"
                />
                <motion.div
                  animate={{ 
                    y: [5, -5, 5],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent rounded-full opacity-40"
                />
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section with Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl p-8 max-w-4xl mx-auto border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Bank-Grade Security Standards
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-muted-foreground">256-bit encryption for all transactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-trust-blue rounded-full" />
                    <span className="text-muted-foreground">CBN compliant payment processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success-gold rounded-full" />
                    <span className="text-muted-foreground">Real-time fraud detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-muted-foreground">WhatsApp end-to-end encryption</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(0, 122, 51, 0.3)",
                      "0 0 30px rgba(0, 122, 51, 0.5)",
                      "0 0 20px rgba(0, 122, 51, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-secondary" />
                    <span className="font-semibold text-foreground">Security Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your Lexi payments are protected with the same security standards 
                    used by Nigerian banks and regulated by the CBN.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};