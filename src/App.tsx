import React, { useState, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { IntroVideo } from './components/IntroVideo';
// Make sure to import any other components you are using (Hero, OurStory, Venue, Schedule, RSVP, Gallery, OrganizerPortal, etc.)

export function App() {
  const [showIntro, setShowIntro] = useState(true);
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

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Optionally auto-play audio when intro completes if desired:
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
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

      {/* Optional Intro Opening Video */}
      {showIntro && <IntroVideo onComplete={handleIntroComplete} />}

      {/* Navigation Bar Linked to Global Audio */}
      <Navigation 
        onOpenOrganizer={() => setOrganizerOpen(true)} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlayAudio} 
      />

      {/* Main Website Sections */}
      <main>
        {/* Place your components here (e.g., Hero, Story, Venue, Schedule, RSVP, Gallery) */}
      </main>
    </div>
  );
}

export default App;
