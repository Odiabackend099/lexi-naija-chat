// src/components/TalkButton.tsx
import { useState } from 'react';
import { unlockAudio, speak } from '../lib/ttsClient';

export default function TalkButton() {
  const [text, setText] = useState('Hello from ODIA TTS');

  const onUnlock = () => unlockAudio(); // call once on first click

  const onSpeak = async () => {
    try {
      await speak(text); // optional second arg: voice id
    } catch (e) {
      console.warn('TTS failed:', e);
      alert('Audio playback failed (browser blocked or network). Try tapping again.');
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="border px-3 py-2 rounded w-72"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something…"
      />
      <button
        className="bg-emerald-700 text-white rounded px-4 py-2"
        onClick={() => { onUnlock(); onSpeak(); }}
      >
        🔊 Speak
      </button>
    </div>
  );
}