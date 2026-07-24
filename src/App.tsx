import React, { useState, useRef } from 'react';
import { Navigation } from './components/Navigation';

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => console.log('Audio playback prevented:', err));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-[#F8F9FA] selection:bg-[#D4AF37] selection:text-[#050B18]">
      {/* Global Background Music Element */}
      <audio 
        ref={audioRef} 
        src={`${import.meta.env.BASE_URL}Sounds.mp3`} 
        loop 
        preload="auto" 
      />

      {/* Navigation Bar Linked to Global Audio */}
      <Navigation 
        onOpenOrganizer={() => setOrganizerOpen(true)} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlayAudio} 
      />

      {/* Main Content Area */}
      <main className="pt-24 px-4 max-w-7xl mx-auto text-center">
        <div id="story" className="py-20">
          <h1 className="font-cinzel text-4xl text-[#E5C158] mb-4">Farah & Seif</h1>
          <p className="text-gray-300 font-serif italic text-lg">September 18, 2027 • Santorini, Greece</p>
        </div>
      </main>
    </div>
  );
}

export default App;
