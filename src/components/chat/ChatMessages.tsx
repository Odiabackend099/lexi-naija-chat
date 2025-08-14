import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatScenario } from '@/data/chatScenarios';

interface ChatMessagesProps {
  scenario: ChatScenario;
  isPlaying: boolean;
  className?: string;
  onMessageComplete?: (messageId: string) => void;
  onScenarioComplete?: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  scenario,
  isPlaying,
  className = '',
  onMessageComplete,
  onScenarioComplete
}) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [messageTimers, setMessageTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Reset when scenario changes
  useEffect(() => {
    // Clear all existing timers
    messageTimers.forEach(timer => clearTimeout(timer));
    setMessageTimers(new Map());
    
    // Reset state
    setVisibleMessages([]);
    setCurrentTypingMessage(null);
    
    // Start new scenario if playing
    if (isPlaying) {
      startScenario();
    }
  }, [scenario.id]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startScenario();
    } else {
      pauseScenario();
    }
  }, [isPlaying]);

  const startScenario = () => {
    const newTimers = new Map<string, NodeJS.Timeout>();

    scenario.messages.forEach((message, index) => {
      // Show typing indicator timer
      if (message.showTyping) {
        const typingTimer = setTimeout(() => {
          setCurrentTypingMessage(message.id);
        }, message.delay);
        newTimers.set(`typing-${message.id}`, typingTimer);
      }

      // Show message timer
      const messageTimer = setTimeout(() => {
        setCurrentTypingMessage(null);
        setVisibleMessages(prev => {
          if (!prev.includes(message.id)) {
            return [...prev, message.id];
          }
          return prev;
        });
        
        onMessageComplete?.(message.id);
        
        // Check if this is the last message
        if (index === scenario.messages.length - 1) {
          setTimeout(() => {
            onScenarioComplete?.();
          }, 1000);
        }
      }, message.delay + (message.showTyping ? 1500 : 0));
      
      newTimers.set(message.id, messageTimer);
    });

    setMessageTimers(newTimers);
  };

  const pauseScenario = () => {
    messageTimers.forEach(timer => clearTimeout(timer));
    setMessageTimers(new Map());
    setCurrentTypingMessage(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      messageTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const visibleScenarioMessages = scenario.messages.filter(message =>
    visibleMessages.includes(message.id)
  );

  return (
    <div className={`flex flex-col justify-end p-4 space-y-3 min-h-full ${className}`}>
      {/* Messages */}
      <AnimatePresence>
        {visibleScenarioMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <ChatMessage message={message} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing Indicator */}
      <AnimatePresence>
        {currentTypingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Progress Indicator */}
      <div className="absolute bottom-2 right-2">
        <div className="flex gap-1">
          {scenario.messages.map((message) => (
            <div
              key={message.id}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                visibleMessages.includes(message.id)
                  ? 'bg-whatsapp-green'
                  : currentTypingMessage === message.id
                  ? 'bg-success-gold animate-pulse'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;