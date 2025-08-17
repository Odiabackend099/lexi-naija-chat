import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CEOSection = () => {
  const handleWhatsAppCTA = () => {
    window.open("https://wa.me/14155238886?text=Hi%20Lexi!%20I%20want%20to%20try%20LexiPay%20AI%20for%20my%20business.%20Please%20set%20me%20up.", "_blank");
  };

  return (
    <section id="agent-lexi" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* CEO Quote */}
          <div className="relative mb-12">
            <Quote className="w-16 h-16 text-accent mx-auto mb-6 opacity-20" />
            <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed text-foreground mb-8">
              "Every Nigerian business deserves an AI financial assistant that actually understands our market. 
              LexiPay isn't just another fintech - it's Nigeria's answer to ChatGPT-5 for financial services."
            </blockquote>
            <footer className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AE</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">Austyn Eguaele</p>
                <p className="text-muted-foreground">CEO & Founder, ODIA.Dev</p>
              </div>
            </footer>
          </div>

          {/* How to Use Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 lg:p-12"
          >
            <h3 className="text-2xl lg:text-3xl font-bold mb-8">
              Getting Started is Simple
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                {
                  step: "01",
                  title: "Start Your Trial",
                  description: "Click the WhatsApp button and tell Lexi you want to try LexiPay AI"
                },
                {
                  step: "02", 
                  title: "Quick Setup",
                  description: "Lexi guides you through 3-minute setup - no forms, no downloads"
                },
                {
                  step: "03",
                  title: "Send Your First Payment",
                  description: "Just say 'send ₦5000 to John' and watch Lexi handle everything"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleWhatsAppCTA}
                size="lg"
                className="bg-whatsapp-green hover:bg-whatsapp-green/90 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Try Lexi Now - It's Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};