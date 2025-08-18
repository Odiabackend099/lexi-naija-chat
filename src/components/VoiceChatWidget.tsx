import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, 
  Loader2, Waves, Circle, Settings, Shield 
} from 'lucide-react';
import { unlockAudio, speak } from '@/lib/ttsClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
interface VoiceChatWidgetProps {
  className?: string;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
}

export const VoiceChatWidget: React.FC<VoiceChatWidgetProps> = ({
  className = '',
  onConversationStart,
  onConversationEnd
}) => {
  const { user, session } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-NG'; // Nigerian English
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleUserSpeech(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access for voice chat",
            variant: "destructive",
          });
        }
        restartListening();
      };
      
      recognition.onend = () => {
        if (isConnected && !isSpeaking) {
          // Restart listening if conversation is active and AI isn't speaking
          setTimeout(() => {
            if (recognitionRef.current && isConnected) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConnected, isSpeaking]);

  // Audio level monitoring
  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  };

  // Handle user speech input
  const handleUserSpeech = async (speechText: string) => {
    if (!speechText.trim()) return;
    
    setIsProcessing(true);
    clearSilenceTimer();
    
    try {
      // Stop listening while processing
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Mock AI response (replace with actual AI service)
      const response = await generateAIResponse(speechText);
      
      setLastResponse(response);
      
      // Speak the response
      setIsSpeaking(true);
      await speak(response);
      
    } catch (error) {
      console.error('Error processing speech:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSpeaking(false);
      setIsProcessing(false);
      setTranscript('');
      
      // Resume listening after a short delay
      setTimeout(() => {
        if (isConnected && recognitionRef.current) {
          recognitionRef.current.start();
        }
      }, 500);
    }
  };

  // Real AI response via Edge Function
  const generateAIResponse = async (userInput: string): Promise<string> => {
    try {
      const { data, error } = await (supabase.functions as any).invoke('lexi-respond', {
        body: { input: userInput, sessionId: user?.id || `anon_${Date.now()}` },
        headers: { 'Content-Type': 'application/json' },
      } as any);
      if (error) throw new Error(error.message || 'AI service error');
      const text = (data && (data.text || data.generatedText || data.reply)) as string;
      return text || 'Sorry, I could not generate a response right now.';
    } catch (e) {
      console.error('AI invocation failed:', e);
      return 'Sorry, I ran into a problem understanding that. Please try again.';
    }
  };

  const startConversation = async () => {
    try {
      unlockAudio();
      await startAudioMonitoring();
      
      setIsConnected(true);
      onConversationStart?.();
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      toast({
        title: "Voice Chat Active",
        description: "Speak naturally - I'm listening and will respond automatically",
      });
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to start voice chat. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setTranscript('');
    setLastResponse('');
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    clearSilenceTimer();
    onConversationEnd?.();
    
    toast({
      title: "Voice Chat Ended",
      description: "Conversation has been terminated",
    });
  };

  const restartListening = () => {
    if (isConnected && recognitionRef.current) {
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 1000);
    }
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  return (
    <div className={`voice-chat-widget ${className}`}>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-premium">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              {isConnected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lexi Voice AI</h3>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Listening...' : 'Ready to chat'}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Voice Visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Main microphone button */}
            <motion.button
              onClick={isConnected ? endConversation : startConversation}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold
                transition-all duration-300 shadow-lg
                ${isConnected 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-whatsapp-green hover:bg-whatsapp-green/90'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? { 
                boxShadow: `0 0 0 ${10 + audioLevel * 20}px rgba(34, 197, 94, 0.3)` 
              } : {}}
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isConnected ? (
                isSpeaking ? <Volume2 className="w-8 h-8" /> : <Mic className="w-8 h-8" />
              ) : (
                <Phone className="w-8 h-8" />
              )}
            </motion.button>

            {/* Audio level rings */}
            {isListening && (
              <div className="absolute inset-0 pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-whatsapp-green/30"
                    animate={{
                      scale: [1, 1.5 + i * 0.3],
                      opacity: [0.6, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Display */}
        <div className="space-y-4">
          {/* Current transcript */}
          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted/50 rounded-lg p-3"
              >
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="text-foreground">{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Last AI response */}
          <AnimatePresence>
            {lastResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-whatsapp-green/10 rounded-lg p-3 border border-whatsapp-green/20"
              >
                <p className="text-sm text-muted-foreground mb-1">Lexi replied:</p>
                <p className="text-foreground">{lastResponse}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connection status */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Circle className={`w-2 h-2 ${isConnected ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="flex items-center gap-2">
              <Waves className={`w-3 h-3 ${isListening ? 'text-blue-500' : 'text-gray-400'}`} />
              {isListening ? 'Listening' : 'Idle'}
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className={`w-3 h-3 ${isSpeaking ? 'text-purple-500' : 'text-gray-400'}`} />
              {isSpeaking ? 'Speaking' : 'Silent'}
            </div>
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {!isConnected ? 
              'Tap to start continuous voice conversation' :
              'Speak naturally - no need to tap or press anything'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChatWidget;