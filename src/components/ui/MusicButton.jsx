import React, { useState, useEffect } from 'react';
import soundEngine from '../../utils/proceduralAudio';

export default function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying && !soundEngine.isMuted);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe(({ isPlaying, isMuted }) => {
      setIsPlaying(isPlaying && !isMuted);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    soundEngine.toggle();
    setIsPlaying(soundEngine.isPlaying && !soundEngine.isMuted);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#24141E]/85 hover:bg-[#24141E] backdrop-blur-md border border-[#D8A85E]/50 text-[#FFEDBA] shadow-lg active:scale-95 transition-all"
      aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
    >
      {/* Animated Soundwave Visualizer */}
      <div className="flex items-center gap-0.5 h-3.5">
        <span
          className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-50'
          }`}
        />
        <span
          className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-2 animate-bounce' : 'h-2 opacity-50'
          }`}
        />
        <span
          className={`w-[2px] bg-[#D8A85E] rounded-full transition-all duration-300 ${
            isPlaying ? 'h-3.5 animate-pulse' : 'h-1 opacity-50'
          }`}
        />
      </div>

      <span className="font-serif text-[11px] tracking-wider uppercase text-[#DFBE95]">
        {isPlaying ? 'Shehnai ON' : 'Muted'}
      </span>
    </button>
  );
}
