// src/lib/ttsClient.ts
import { supabase } from '@/integrations/supabase/client';

const FALLBACK_BASE = 'https://odia-tts-render.onrender.com';
const DEFAULT_VOICE = 'en-NG-EzinneNeural';

let audioCtx: AudioContext | null = null;

// Enhanced input sanitization
function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?;:()\-\u00C0-\u017F]/g, '') // Allow only safe characters including accented letters
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 1000); // Limit to 1000 characters
}

/** Must be called from a user gesture (click/tap) once to unlock audio */
export function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

/** Secure TTS using backend Edge Function with rate limiting and authentication */
export async function speak(text: string, voice = DEFAULT_VOICE) {
  if (!text?.trim()) return;

  try {
    // Sanitize input before sending
    const sanitizedText = sanitizeInput(text);
    
    if (!sanitizedText || sanitizedText.length < 1) {
      throw new Error('Invalid or empty text input');
    }

    // Get current session token (optional for anonymous users)
    const { data: { session } } = await supabase.auth.getSession();
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    };
    
    // Add auth header if user is logged in
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    // Call secure TTS Edge Function (works for both authenticated and anonymous users)
    const { data, error } = await (supabase.functions as any).invoke('secure-tts', {
      body: { 
        text: sanitizedText,
        voice,
        sessionId: session?.user?.id || `anon_${Date.now()}`
      },
      headers,
      
    } as any);

    if (error) {
      console.error('TTS Edge Function error:', error);
      throw new Error(error.message || 'TTS service failed');
    }

    // Normalize response to raw MPEG bytes (supports base64 JSON or binary)
    let audioBytes: Uint8Array | null = null;

    if (data && typeof data === 'object' && 'audioContent' in (data as any)) {
      // JSON payload with base64 audio (e.g., { audioContent: "..." })
      const base64 = (data as any).audioContent as string;
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      audioBytes = bytes;
    } else if (typeof data === 'string') {
      // Sometimes functions return base64 string directly
      try {
        const bin = atob(data);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        audioBytes = bytes;
      } catch {
        // Not base64, will fall back
      }
    } else if (data instanceof ArrayBuffer) {
      audioBytes = new Uint8Array(data as ArrayBuffer);
    } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
      const buf = await (data as Blob).arrayBuffer();
      audioBytes = new Uint8Array(buf);
    }

    if (!audioBytes || audioBytes.length === 0) {
      throw new Error('Unexpected TTS response format');
    }

    const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.crossOrigin = 'anonymous';

    try {
      await audio.play();
      return await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); // Clean up memory
          resolve();
        };
        audio.onerror = (e) => {
          URL.revokeObjectURL(audioUrl);
          reject(e);
        };
      });
    } catch (err) {
      URL.revokeObjectURL(audioUrl);
      throw err;
    }

  } catch (err) {
    console.error('Secure TTS failed:', err);
    // Fallback to direct TTS for anonymous users or when edge function fails
    console.log('Falling back to direct TTS service...');
    return await speakFallback(text, voice);
  }
}

/** Fallback TTS implementation (direct call) */
async function speakFallback(text: string, voice = DEFAULT_VOICE) {
  // build URL
  const url = `${FALLBACK_BASE}/speak?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`;

  // Easiest: stream via <audio> so we don't load the whole file into memory
  const audio = new Audio(url);
  audio.crossOrigin = 'anonymous';

  try {
    await audio.play(); // requires prior unlockAudio() in a user gesture
    return await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);
    });
  } catch (err) {
    // soft fallback beep so the UI isn't "silent fail"
    beep();
    throw err;
  }
}

function beep() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 660;
    g.gain.value = 0.15;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.18);
  } catch { /* ignore */ }
}