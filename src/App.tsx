import React, { useState, useEffect, useRef } from 'react';
import { IntroVideo } from './components/IntroVideo';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { Countdown } from './components/Countdown';
import { OurStory } from './components/OurStory';
import { VenueSection } from './components/VenueSection';
import { WeddingSchedule } from './components/WeddingSchedule';
import { RSVPSection } from './components/RSVPSection';
import { PhotoUploadSection } from './components/PhotoUploadSection';
import { GallerySection } from './components/GallerySection';
import { OrganizerPortal } from './components/OrganizerPortal';
import { Footer } from './components/Footer';
import { PhotoItem } from './types';

// Global Background Audio Component
const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const playAudio = () => {
      audio.play().catch((err) => {
        console.warn('Autoplay prevented by browser, waiting for user interaction:', err);
      });
    };

    playAudio();

    const handleFirstInteraction = () => {
      playAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      src={`${import.meta.env.BASE_URL}Sounds.mp3`}
    />
  );
};

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [newlyUploadedPhoto, setNewlyUploadedPhoto] = useState<PhotoItem | null>(null);

  // Always force scroll to top on refresh or initial load
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#060D1F] text-[#F8F9FA] relative selection:bg-[#D4AF37] selection:text-[#060D1F]">
      {/* Background Music Player */}
      <BackgroundAudio />

      {/* 1. Fullscreen Intro Video Screen */}
      {!introFinished && <IntroVideo onComplete={() => setIntroFinished(true)} />}

      {/* Main Wedding Website */}
      <Navigation onOpenOrganizer={() => setOrganizerOpen(true)} />

      <main>
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Countdown Timer */}
        <Countdown />

        {/* 4. How We Met / Our Story */}
        <OurStory />

        {/* 5. Venue & Travel */}
        <VenueSection />

        {/* 6. Wedding Schedule */}
        <WeddingSchedule />

        {/* 7. RSVP Form (Supabase) */}
        <RSVPSection />

        {/* 8. Photo Upload Portal */}
        <PhotoUploadSection onPhotoUploaded={(photo) => setNewlyUploadedPhoto(photo)} />

        {/* 9. Photo Gallery */}
        <GallerySection newPhotoTrigger={newlyUploadedPhoto} />
      </main>

      {/* 10. Organizer Admin Portal Modal */}
      <OrganizerPortal isOpen={organizerOpen} onClose={() => setOrganizerOpen(false)} />

      {/* 11. Footer */}
      <Footer onOpenOrganizer={() => setOrganizerOpen(true)} />
    </div>
  );
}
