import { motion } from "framer-motion";
import { useState } from "react";
import nigerianWomanWhatsapp from "@/assets/nigerian-woman-whatsapp.jpg";
import nigerianManMarket from "@/assets/nigerian-man-market.jpg";
import nigerianEntrepreneurSalon from "@/assets/nigerian-entrepreneur-salon.jpg";
import nigerianCoupleRestaurant from "@/assets/nigerian-couple-restaurant.jpg";

const useCases = [
  {
    id: "office-payments",
    title: "Office Business Payments",
    description: "Send salaries and supplier payments in seconds, no cash, no apps.",
    amount: "₦25,000",
    recipient: "to Staff Adunni",
    image: nigerianWomanWhatsapp,
    icon: "💼"
  },
  {
    id: "market-vendor",
    title: "Market Vendor Transactions", 
    description: "Settle up at your local market with just a scan.",
    amount: "₦8,500",
    recipient: "to Mama Folake",
    image: nigerianManMarket,
    icon: "🏪"
  },
  {
    id: "salon-bills",
    title: "Salon & Beauty Services",
    description: "Split bills fast. No awkward delays.",
    amount: "₦12,000",
    recipient: "to Beauty Palace",
    image: nigerianEntrepreneurSalon,
    icon: "💅"
  },
  {
    id: "restaurant-splitting",
    title: "Restaurant Bill Splitting",
    description: "Get styled, then settle up. All simple.",
    amount: "₦6,800",
    recipient: "to Bukky & Tunde",
    image: nigerianCoupleRestaurant,
    icon: "🍽️"
  }
];

export const UseCasesSection = () => {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-secondary mb-4 tracking-wider uppercase"
          >
            SEND TO ANY BANK FROM LEXI
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Where Lexi Fits Into Everyday Lives
          </motion.h2>
        </div>

        {/* Use Cases Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredCase(useCase.id)}
              onHoverEnd={() => setHoveredCase(null)}
              className="relative group cursor-pointer"
            >
              {/* Card */}
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg bg-card border border-border">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Payment Notification */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  className="absolute top-4 left-4 right-4"
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-lg">{useCase.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">
                          Sent {useCase.amount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {useCase.recipient}
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: hoveredCase === useCase.id ? 1.1 : 1 }}
                        className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bank Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">GTB</span>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">UBA</span>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">FBN</span>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZTH</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-sm text-muted-foreground">Nigerian Banks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};