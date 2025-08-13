import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold">
              Lexi<span className="text-secondary">Pay</span> AI
            </h3>
            <p className="text-muted-foreground">
              ChatGPT-5 for Nigerian Financial Services. Built by ODIA.Dev for Nigerian businesses.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Lagos, Nigeria
            </div>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#demo" className="hover:text-foreground transition-colors">Demo</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="https://odia.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">ODIA.Dev</a></li>
              <li><a href="#agent-lexi" className="hover:text-foreground transition-colors">Agent Lexi</a></li>
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Get Started</h4>
            <button
              onClick={() => window.open("https://wa.me/14155238886?text=Hi%20Lexi!%20I%20want%20to%20try%20LexiPay%20AI%20for%20my%20business.%20Please%20set%20me%20up.", "_blank")}
              className="flex items-center gap-2 text-whatsapp-green hover:text-whatsapp-green/80 transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Start in WhatsApp
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              support@odia.dev
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} ODIA.Dev. All rights reserved. CBN Compliant • NDPR Certified
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>🇳🇬 Built for Nigeria</span>
            <span>🔒 Bank-Grade Security</span>
            <span>⚡ Powered by AI</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};