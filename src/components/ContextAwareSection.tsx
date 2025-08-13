import { motion } from "framer-motion";
import { Brain, MessageCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

export const ContextAwareSection = () => {
  const [currentConversation, setCurrentConversation] = useState(0);

  const conversations = [
    {
      id: 0,
      messages: [
        { type: "user", text: "Send 2k to my GTB", time: "12:48 PM" },
        { type: "lexi", text: "Please enter the recipient's account number for your GTB.", time: "12:48 PM" },
        { type: "user", text: "The last GTbank I sent money to", time: "12:48 PM" },
        { type: "lexi", text: "Do you mean account number 0240256606?", time: "12:48 PM" },
        { type: "user", text: "What's the name", time: "12:48 PM" },
        { type: "lexi", text: "The name associated with account number 0240256606 is SULAIMAN ABDULSEMU ADEWALE.", time: "12:47 PM" },
        { type: "user", text: "Yes", time: "12:47 PM" },
        { type: "lexi", text: "Are you sure you want to transfer ₦2,000.00 to SULAIMAN ABDULSEMU ADEWALE (0240256606) at Guaranty Trust Bank?", time: "12:47 PM" },
        { type: "user", text: "Yes", time: "12:47 PM" }
      ]
    }
  ];

  const floatingIcons = [
    { icon: Brain, color: "text-pink-500", delay: 0 },
    { icon: MessageCircle, color: "text-blue-500", delay: 0.5 },
    { icon: Lightbulb, color: "text-yellow-500", delay: 1 },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Floating Icons */}
            {floatingIcons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0],
                  transition: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: item.delay
                  }
                }}
                className={`absolute ${index === 0 ? 'top-0 right-20' : index === 1 ? 'top-32 right-0' : 'top-64 right-12'}`}
              >
                <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
              </motion.div>
            ))}

            {/* Main Content */}
            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-medium text-secondary mb-4 tracking-wider uppercase"
              >
                CONTEXT AWARE
              </motion.p>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
              >
                It Remembers,{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  So You Don't Have To
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8"
              >
                Lexi keeps track of your past questions and actions, so 
                conversations feel natural, seamless, and actually helpful.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-foreground text-background px-8 py-4 rounded-xl font-semibold hover:bg-foreground/90 transition-colors duration-200"
              >
                Try It Out
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Phone Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Phone Frame */}
            <div className="relative w-80 h-[650px]">
              {/* Phone Mockup */}
              <div className="w-full h-full bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-gray-900 rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-12 bg-gray-800 flex items-center justify-between px-4 text-white text-sm">
                    <span>12:47</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-1 h-3 bg-white rounded"></div>
                        <div className="w-1 h-3 bg-white rounded"></div>
                        <div className="w-1 h-3 bg-white/50 rounded"></div>
                      </div>
                      <span className="ml-2">📶</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  {/* WhatsApp Header */}
                  <div className="h-16 bg-whatsapp-green flex items-center px-4 text-white">
                    <button className="mr-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-whatsapp-green font-bold">L</span>
                      </div>
                      <div>
                        <div className="font-semibold">Lexi</div>
                        <div className="text-xs opacity-80">Online</div>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-4">
                      <button>📞</button>
                      <button>⋮</button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-2 h-[calc(100%-8rem)]">
                    {conversations[currentConversation].messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                            message.type === "user"
                              ? "bg-whatsapp-green text-white rounded-br-md"
                              : "bg-gray-700 text-white rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <div className="text-xs opacity-70 mt-1 text-right">
                            {message.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="h-16 bg-gray-800 flex items-center px-4 gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full px-4 py-2 text-white text-sm">
                      Type a message...
                    </div>
                    <button className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Transaction Summary */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -right-8 top-32 bg-card border border-border rounded-2xl p-4 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">₦50,000</div>
                  <div className="text-sm text-muted-foreground">Quarterly Total Bank</div>
                  <div className="text-xs text-muted-foreground">0001234567</div>
                  <div className="mt-2 text-xs text-muted-foreground">April till now</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};