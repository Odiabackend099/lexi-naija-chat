import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
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
      {/* Phone Container */}
      <motion.div
        className="relative mx-auto"
        style={{ width: '300px', height: '600px' }}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsPaused(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPaused(false);
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* iPhone Frame */}
        <div className="relative w-full h-full">
          {/* Phone Bezel */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-premium">
            {/* Screen */}
            <div className="absolute inset-0 m-3 bg-black rounded-[2.5rem] overflow-hidden">
              {/* Status Bar */}
              <div className="h-12 bg-black flex items-center justify-between px-6 text-white text-sm">
                <span className="font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="h-16 bg-whatsapp-green flex items-center px-4 gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Lexi AI</h3>
                  <p className="text-white/80 text-xs">ODIA.Dev Assistant • Online</p>
                </div>
                <div className="flex gap-2">
                  <Volume2 className="w-5 h-5 text-white/80" />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 bg-gray-100 relative overflow-hidden">
                {/* WhatsApp Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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

              {/* WhatsApp Input */}
              <div className="h-16 bg-gray-100 border-t border-gray-200 flex items-center px-4 gap-3">
                <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Try this conversation →</span>
                </div>
                <WhatsAppCTA
                  variant="inline"
                  messageTemplate="demo"
                  text="Open"
                  size="sm"
                  className="text-whatsapp-green hover:text-whatsapp-green/80"
                />
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

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-success-gold rounded-full opacity-60"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary rounded-full opacity-60"
          animate={{
            y: [0, 10, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
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