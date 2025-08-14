import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Mic, Volume2, TrendingUp, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/data/chatScenarios';

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className = ''
}) => {
  const isUser = message.role === 'user';
  const isLexi = message.role === 'lexi';

  const renderMessageContent = () => {
    const baseText = message.text;
    
    // Handle masked text (PIN entries)
    if (message.masked) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl tracking-widest">{baseText}</span>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-5 bg-current"
          />
        </div>
      );
    }

    // Handle voice messages
    if (message.isVoice) {
      return (
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-8 h-8 bg-whatsapp-green rounded-full flex items-center justify-center"
          >
            <Mic className="w-4 h-4 text-white" />
          </motion.div>
          <span>{baseText.replace('🎤 ', '')}</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Main text with emoji and formatting preservation */}
        <div className="whitespace-pre-line">
          {baseText.split('\n').map((line, index) => (
            <div key={index} className={index > 0 ? 'mt-1' : ''}>
              {line}
            </div>
          ))}
        </div>

        {/* Voice response indicator */}
        {message.showVoiceResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-200"
          >
            <Volume2 className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600">Voice response available</span>
          </motion.div>
        )}

        {/* Chart indicator */}
        {message.showChart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-600">Detailed analytics available</span>
          </motion.div>
        )}

        {/* Celebration effect */}
        {message.showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8]
            }}
            transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
            className="flex items-center gap-2 mt-2"
          >
            <Sparkles className="w-5 h-5 text-success-gold" />
            <span className="text-xs text-success-gold font-medium">Payment successful!</span>
          </motion.div>
        )}

        {/* Quick reply options */}
        {message.showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {message.showOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors border border-gray-200"
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  const renderMessageStatus = () => {
    if (!isUser) return null;

    return (
      <div className="flex justify-end mt-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message.masked ? (
            <Check className="w-3 h-3 text-white/70" />
          ) : (
            <CheckCheck className="w-3 h-3 text-white/70" />
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      <motion.div
        layout
        className={`
          max-w-[80%] px-3 py-2 rounded-2xl relative
          ${isUser
            ? 'bg-whatsapp-green text-white rounded-br-md ml-8'
            : 'bg-white text-gray-800 rounded-bl-md mr-8 border border-gray-200'
          }
          ${message.showCelebration ? 'shadow-lg shadow-success-gold/20' : ''}
        `}
      >
        {/* Avatar for Lexi messages */}
        {isLexi && (
          <div className="absolute -left-8 bottom-0 w-6 h-6 rounded-full bg-whatsapp-green flex items-center justify-center text-xs">
            🤖
          </div>
        )}

        {/* Message content */}
        <div className="text-sm leading-relaxed">
          {renderMessageContent()}
        </div>

        {/* Message timestamp */}
        <div className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Message status for user messages */}
        {renderMessageStatus()}
      </motion.div>
    </div>
  );
};

export default ChatMessage;