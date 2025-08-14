import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  className?: string;
  avatar?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = '',
  avatar
}) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 mr-8 border border-gray-200 relative">
        {/* Avatar */}
        <div className="absolute -left-8 bottom-0 w-6 h-6 rounded-full bg-whatsapp-green flex items-center justify-center text-xs">
          🤖
        </div>

        {/* Typing animation */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-2">Lexi is typing</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;