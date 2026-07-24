import React, { useState, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { IntroVideo } from './components/IntroVideo';
import { HeroSection } from './components/HeroSection';
import { OurStory } from './components/OurStory';
import { VenueSection } from './components/VenueSection';
import { Schedule } from './components/Schedule';
import { RSVPSection } from './components/RSVPSection';
import { GallerySection } from './components/GallerySection';
import { OrganizerPortal } from './components/OrganizerPortal';
import { Footer } from './components/Footer';

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

      {/* Intro Opening Video */}
      {showIntro && <IntroVideo onComplete={handleIntroComplete} />}

      {/* Navigation Bar Linked to Global Audio */}
      <Navigation 
        onOpenOrganizer={() => setOrganizerOpen(true)} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlayAudio} 
      />

      {/* Main Website Content Sections */}
      <main>
        <HeroSection />
        <OurStory />
        <VenueSection />
        <Schedule />
        <RSVPSection />
        <GallerySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Organizer Portal Modal */}
      {organizerOpen && (
        <OrganizerPortal onClose={() => setOrganizerOpen(false)} />
      )}
    </div>
  );
}

export default App;
