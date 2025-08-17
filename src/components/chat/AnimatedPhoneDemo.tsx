import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, Mic } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { chatScenarios, ScenarioHelpers } from '@/data/chatScenarios';
import { WhatsAppCTA } from '@/components/integrations/WhatsAppCTA';

interface AnimatedPhoneDemoProps {
  autoPlay?: boolean;
  className?: string;
  showControls?: boolean;
  initialScenario?: string;
}

export const AnimatedPhoneDemo: React.FC<AnimatedPhoneDemoProps> = ({
  autoPlay = true,
  className = '',
  showControls = true,
  initialScenario
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Get initial scenario index if provided
  useEffect(() => {
    if (initialScenario) {
      const index = chatScenarios.findIndex(s => s.id === initialScenario);
      if (index !== -1) {
        setCurrentScenarioIndex(index);
      }
    }
  }, [initialScenario]);

  // Auto-advance scenarios
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const currentScenario = chatScenarios[currentScenarioIndex];
    if (!currentScenario) return;

    const scenarioDuration = ScenarioHelpers.getTotalDuration(currentScenario.id);
    const totalDuration = (scenarioDuration + 3) * 1000; // Add 3s pause between scenarios

    intervalRef.current = setTimeout(() => {
      setCurrentScenarioIndex(prev => (prev + 1) % chatScenarios.length);
    }, totalDuration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentScenarioIndex, isPlaying, isPaused]);

  // Handle scenario change
  const handleScenarioChange = (index: number) => {
    setCurrentScenarioIndex(index);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  // Handle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle next scenario
  const nextScenario = () => {
    const nextIndex = (currentScenarioIndex + 1) % chatScenarios.length;
    handleScenarioChange(nextIndex);
  };

  const currentScenario = chatScenarios[currentScenarioIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Phone Container - Performance Optimized */}
      <motion.div
        className="relative mx-auto will-change-transform"
        style={{ width: '300px', height: '600px' }}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsPaused(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPaused(false);
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Realistic iPhone Frame */}
        <div className="relative w-full h-full">
          {/* Phone Bezel - More realistic iPhone design */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[3.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-gray-700/50">
            {/* Screen with realistic bezels */}
            <div className="absolute inset-[6px] bg-black rounded-[3rem] overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-full z-10"></div>
              
              {/* Status Bar - Real iOS style */}
              <div className="h-14 bg-black flex items-center justify-between px-8 pt-2 text-white text-sm font-medium">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-3" viewBox="0 0 24 18" fill="white">
                    <rect width="5" height="12" rx="1"/>
                    <rect x="7" width="5" height="16" rx="1"/>
                    <rect x="14" width="5" height="8" rx="1"/>
                    <rect x="21" width="3" height="4" rx="1"/>
                  </svg>
                  <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
                    <rect x="2" y="3" width="20" height="10" rx="5" stroke="white" strokeWidth="1"/>
                    <rect x="22" y="6" width="2" height="4" rx="1" fill="white"/>
                  </svg>
                  <span className="text-xs">100%</span>
                </div>
              </div>

              {/* Real WhatsApp Header */}
              <div className="h-16 bg-[#075E54] flex items-center px-4 gap-3 border-b border-black/10">
                <motion.button 
                  className="p-2 -ml-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                </motion.button>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                  <span className="text-xl">🤖</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base">Lexi AI</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online • ODIA.Dev Assistant
                  </p>
                </div>
                
                <div className="flex gap-6">
                  <motion.button 
                    className="p-2 rounded-full hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
                    </svg>
                  </motion.button>
                  <motion.button 
                    className="p-2 rounded-full hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </motion.button>
                  <motion.button 
                    className="p-2 rounded-full hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Chat Area - Real WhatsApp dark theme */}
              <div className="flex-1 bg-[#0d1418] relative overflow-hidden">
                {/* WhatsApp chat wallpaper pattern */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0 0c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8zM0 20c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8zm40 0c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* Messages */}
                <div className="relative h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="h-full"
                    >
                      <ChatMessages
                        scenario={currentScenario}
                        isPlaying={isPlaying && !isPaused}
                        className="h-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Real WhatsApp Input */}
              <div className="h-16 bg-[#1e1e1e] border-t border-gray-800 flex items-center px-4 gap-3">
                <motion.button 
                  className="p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9,11H15L12,8L9,11M11,2V7.5L5.5,12L11,16.5V22L20,13L11,2Z"/>
                  </svg>
                </motion.button>
                
                <div className="flex-1 bg-[#2d2d2d] rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-white/50 text-sm">Type a message</span>
                </div>
                
                <motion.button 
                  className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Hover Overlay with Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-10"
              >
                Click to try this conversation in WhatsApp
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Elements - Performance Optimized */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-success-gold rounded-full opacity-60 will-change-transform"
          animate={{
            y: [0, -8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary rounded-full opacity-60 will-change-transform"
          animate={{
            y: [0, 8, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />
      </motion.div>

      {/* Scenario Selector */}
      <div className="mt-8 space-y-4">
        {/* Current Scenario Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">
            {currentScenario.icon} {currentScenario.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {currentScenario.description}
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-whatsapp-green text-white flex items-center justify-center hover:bg-whatsapp-green/90 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            <button
              onClick={nextScenario}
              className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Next scenario"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scenario Dots */}
        <div className="flex justify-center gap-2">
          {chatScenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentScenarioIndex
                  ? 'bg-whatsapp-green scale-125'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`View ${scenario.title} scenario`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedPhoneDemo;