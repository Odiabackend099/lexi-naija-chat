import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "lexi";
  text: string;
  timestamp?: string;
  status?: "sending" | "sent" | "delivered" | "read";
}

const demoConversations: Message[][] = [
  // Primary Payment Demo
  [
    { id: 1, sender: "user" as const, text: "Lexi, send ₦15,000 to my supplier 0123456789" },
    { id: 2, sender: "lexi" as const, text: "Recipient: ADEBAYO SUPPLIES (GTBank). Confirm ₦15,000 transfer?" },
    { id: 3, sender: "user" as const, text: "Yes, urgent" },
    { id: 4, sender: "lexi" as const, text: "PIN please (4-digits for security)" },
    { id: 5, sender: "user" as const, text: "1234" },
    { id: 6, sender: "lexi" as const, text: "Payment link generated. Tap to approve via your bank app." },
    { id: 7, sender: "lexi" as const, text: "✅ Transfer confirmed! ₦15,000 sent to ADEBAYO SUPPLIES. Receipt saved." }
  ],
  // Expense Tracking Demo
  [
    { id: 1, sender: "user" as const, text: "How much did I spend on transport this week?" },
    { id: 2, sender: "lexi" as const, text: "₦12,500 on transport. You're ₦2,500 over budget." },
    { id: 3, sender: "user" as const, text: "Show me the breakdown" },
    { id: 4, sender: "lexi" as const, text: "Monday: ₦2,000 (Uber)\nTuesday: ₦1,500 (Bus)\nWednesday: ₦3,000 (Keke)\nThursday: ₦2,500 (Uber)\nFriday: ₦3,500 (Taxi)" }
  ],
  // Invoice Generation Demo
  [
    { id: 1, sender: "user" as const, text: "Create invoice for ₦50k website project" },
    { id: 2, sender: "lexi" as const, text: "Invoice #001 created for ODIA.DEV. Sent to client via WhatsApp." },
    { id: 3, sender: "user" as const, text: "When will I get paid?" },
    { id: 4, sender: "lexi" as const, text: "Payment due: Dec 31, 2024. I'll remind you 2 days before." }
  ]
];

interface ChatAnimationProps {
  isPaused?: boolean;
}

export const ChatAnimation = ({ isPaused = false }: ChatAnimationProps) => {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  const conversation = demoConversations[currentConversation];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (currentMessageIndex < conversation.length) {
        setIsTyping(true);
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, conversation[currentMessageIndex]]);
          setIsTyping(false);
          setCurrentMessageIndex(prev => prev + 1);
        }, 1500);
      } else {
        // Reset and move to next conversation
        setTimeout(() => {
          setVisibleMessages([]);
          setCurrentMessageIndex(0);
          setCurrentConversation(prev => (prev + 1) % demoConversations.length);
        }, 3000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentMessageIndex, conversation, isPaused, currentConversation]);

  return (
    <div className="h-full flex flex-col justify-end space-y-3">
      <AnimatePresence>
        {visibleMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                message.sender === "user"
                  ? "bg-whatsapp-green text-white rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              {message.sender === "user" && (
                <div className="flex justify-end mt-1">
                  <CheckCheck className="w-3 h-3 text-white/70" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex justify-start"
        >
          <div className="bg-card border border-border rounded-2xl rounded-bl-md px-3 py-2">
            <div className="flex space-x-1">
              <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};