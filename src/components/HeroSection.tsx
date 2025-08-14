import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import AnimatedPhoneDemo from "./chat/AnimatedPhoneDemo";
import { FloatingElements3D } from "./FloatingElements3D";
import { ParallaxContainer, ParallaxLayer } from "./ParallaxContainer";
import { WhatsAppCTA } from "./integrations/WhatsAppCTA";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handleWhatsAppCTA = () => {
    window.open("https://wa.me/14155238886?text=Hi%20Lexi!%20I%20want%20to%20try%20LexiPay%20AI%20for%20my%20business.%20Please%20set%20me%20up.", "_blank");
  };

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden perspective">
      {/* 3D Floating Elements Background */}
      <FloatingElements3D />
      
      {/* Parallax Background Layers */}
      <ParallaxLayer speed="slow" className="z-0">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 gradient-hero"
        />
      </ParallaxLayer>
      
      {/* Background Elements with Parallax */}
      <ParallaxLayer speed="medium" className="z-10">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ParallaxLayer>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-20">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: textY }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium border border-secondary/30"
          >
            <motion.div 
              className="w-2 h-2 bg-secondary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            From the makers of Agent Lexi
          </motion.div>

          {/* Main Headline */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold leading-tight preserve-3d"
            >
              <motion.span
                animate={{ 
                  rotateX: [0, 5, 0],
                  rotateY: [0, -2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                Imagine ChatGPT-5{" "}
              </motion.span>
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Serving as Your Personal AI
              </span>{" "}
              Financial Assistant, Anytime, Anywhere
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground mt-6 leading-relaxed"
            >
              Unlock smarter financial choices with Lexi, your AI-powered assistant on WhatsApp, 
              making every transaction simpler and more intuitive for{" "}
              <span className="text-foreground font-semibold">Nigerian businesses.</span>
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <WhatsAppCTA
              variant="primary"
              size="lg"
              messageTemplate="trial"
              context="hero_cta"
              className="shadow-glow preserve-3d"
            />
            
            <motion.button
              className="px-8 py-4 text-lg font-semibold rounded-xl border border-border hover:bg-card/50 flex items-center gap-3 transition-all duration-300 glass preserve-3d"
              whileHover={{ 
                scale: 1.05,
                rotateX: -5,
                rotateY: 5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Watch 60-sec Demo
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              7-day free trial
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trust-blue rounded-full" />
              CBN compliant
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success-gold rounded-full" />
              No setup fees
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Phone Demo */}
        <ParallaxContainer speed={0.3} className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <AnimatedPhoneDemo />
          </motion.div>
        </ParallaxContainer>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};