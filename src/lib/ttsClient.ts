// src/lib/ttsClient.ts
const BASE = import.meta.env.VITE_TTS_BASE_URL || 'https://odia-tts-render.onrender.com';
const DEFAULT_VOICE = 'en-NG-EzinneNeural';

let audioCtx: AudioContext | null = null;

/** Must be called from a user gesture (click/tap) once to unlock audio */
export function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

/** Speak any text using ODIA TTS */
export async function speak(text: string, voice = DEFAULT_VOICE) {
  if (!text?.trim()) return;

  // build URL
  const url = `${BASE}/speak?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`;

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