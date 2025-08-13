import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does LexiPay AI work with Nigerian banks?",
    answer: "LexiPay AI is integrated with all major Nigerian banks including GTBank, First Bank, UBA, Zenith, and Access Bank. We use secure banking APIs and comply with CBN regulations for all transactions."
  },
  {
    question: "Is LexiPay AI CBN compliant?",
    answer: "Yes, LexiPay AI is fully compliant with Central Bank of Nigeria regulations. We're also NDPR certified for data protection and use bank-grade security for all financial transactions."
  },
  {
    question: "What languages does Lexi support?",
    answer: "Lexi speaks English, Nigerian Pidgin, Yoruba, and Igbo. She understands Nigerian business context and can switch between languages in the same conversation."
  },
  {
    question: "How much does LexiPay AI cost?",
    answer: "We start at ₦5,000/month with a 7-day free trial. Pricing scales based on transaction volume. Enterprise plans start at ₦50,000/month with unlimited transactions."
  },
  {
    question: "Can I use LexiPay AI without downloading an app?",
    answer: "Yes! LexiPay AI works directly in WhatsApp Business. No app downloads required. Just add Lexi as a contact and start chatting."
  },
  {
    question: "How secure are my financial transactions?",
    answer: "We use 256-bit encryption and bank-grade security. All transactions are processed through secure banking APIs. We never store your banking credentials or PINs."
  },
  {
    question: "Can I upgrade to Agent Lexi for full business automation?",
    answer: "Absolutely! LexiPay AI customers get priority access to Agent Lexi, our complete business automation platform. We'll help you migrate seamlessly when you're ready."
  },
  {
    question: "What happens after my free trial?",
    answer: "After 7 days, you can choose to upgrade to a paid plan or continue with limited features. We'll send you a message in WhatsApp before your trial expires."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about LexiPay AI for Nigerian businesses
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="border border-border rounded-2xl overflow-hidden bg-card"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-secondary" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <button 
            onClick={() => window.open("https://wa.me/14155238886?text=Hi%20Lexi!%20I%20have%20questions%20about%20LexiPay%20AI.", "_blank")}
            className="text-secondary hover:underline font-medium"
          >
            Chat with our team on WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
};