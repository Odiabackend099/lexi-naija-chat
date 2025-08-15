import { motion } from "framer-motion";
import { useState } from "react";
import { ChatAnimation } from "./ChatAnimation";
import whatsappLogo from "@/assets/whatsapp-logo.png";

export const AnimatedPhone = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        className="relative will-change-transform"
        initial={{ rotateY: -10, scale: 0.9, opacity: 0 }}
        animate={{ 
          rotateY: isHovered ? 0 : -10, 
          scale: isHovered ? 1 : 0.9,
          opacity: 1
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.6 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ perspective: "1000px" }}
      >
        {/* iPhone Frame */}
        <div className="relative w-72 h-[600px] bg-black rounded-[3rem] p-2 shadow-premium">
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden border border-border relative">
            {/* Status Bar */}
            <div className="h-12 bg-whatsapp-green flex items-center justify-between px-4 text-white text-sm font-medium">
              <div className="flex items-center gap-2">
                <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6" />
                <span>Lexi - Your AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-hidden">
              <ChatAnimation isPaused={isHovered} />
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg"
          >
            <p className="text-sm text-foreground whitespace-nowrap">
              Try this in WhatsApp
            </p>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card border-l border-t border-border rotate-45"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Elements - Optimized */}
      <motion.div
        className="absolute -top-10 -right-10 w-6 h-6 bg-success-gold rounded-full will-change-transform"
        animate={{ y: [0, 20, 0] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className="absolute -bottom-10 -left-10 w-4 h-4 bg-secondary rounded-full will-change-transform"
        animate={{ y: [0, -15, 0] }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      />
    </div>
  );
};