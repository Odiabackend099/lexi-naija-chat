import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChatAnimation } from "./ChatAnimation";

export const AnimatedPhone = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex justify-center items-center">
      <motion.div
        className="relative"
        initial={{ rotateY: -15, scale: 0.8 }}
        animate={{ 
          rotateY: isHovered ? 0 : -15, 
          scale: isHovered ? 0.95 : 0.8 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-whatsapp-green font-bold text-xs">L</span>
                </div>
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

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-6 h-6 bg-success-gold rounded-full"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute -bottom-10 -left-10 w-4 h-4 bg-secondary rounded-full"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};