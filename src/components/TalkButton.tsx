// src/components/TalkButton.tsx
import { useState } from 'react';
import { Volume2, VolumeX, Loader2, Shield } from 'lucide-react';
import { unlockAudio, speak } from '../lib/ttsClient';
import { motion } from 'framer-motion';

export default function TalkButton() {
  const [text, setText] = useState('Hello from ODIA TTS - secure voice AI for Nigerian financial services');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onUnlock = () => unlockAudio(); // call once on first click

  const onSpeak = async () => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      setHasError(false);
      
      // Unlock audio first
      onUnlock();
      
      // Use secure TTS
      await speak(text);
      
    } catch (e) {
      console.warn('TTS failed:', e);
      setHasError(true);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 text-whatsapp-green" />
        <span>Secure TTS with rate limiting & audit logging</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center max-w-2xl mx-auto">
        <input
          className="flex-1 border border-border px-4 py-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-green/20 focus:border-whatsapp-green"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to hear it spoken with Nigerian voice AI..."
        />
        <motion.button
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isSpeaking 
              ? 'bg-gray-100 text-gray-500 cursor-wait' 
              : hasError
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-whatsapp-green text-white hover:bg-whatsapp-green/90 shadow-lg hover:shadow-glow'
            }
          `}
          onClick={onSpeak}
          disabled={isSpeaking || !text.trim()}
          whileHover={{ scale: isSpeaking ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSpeaking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Speaking...
            </>
          ) : hasError ? (
            <>
              <VolumeX className="w-5 h-5" />
              Try Again
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              🔊 Speak
            </>
          )}
        </motion.button>
      </div>
      
      {/* Voice Models Info */}
      <div className="text-center text-xs text-muted-foreground">
        Using Nigerian AI voice models • Powered by ODIA.Dev infrastructure
      </div>
    </div>
  );
}