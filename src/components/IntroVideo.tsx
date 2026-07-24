import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Disable background scrolling while intro is visible
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (videoRef.current && !videoError) {
        videoRef.current.muted = true; // Kept muted so it never clashes with Sounds.mp3
        videoRef.current
          .play()
          .catch(() => setVideoError(true));
      } else if (videoError) {
        handleEnter();
      }
    }
  };

  const handleEnter = () => {
    setHasEnded(true);
    setTimeout(() => {
      onComplete();
    }, 1000); // 1s smooth dissolve transition
  };

  return (
    <AnimatePresence>
      {!hasEnded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={!hasStarted ? handleStart : undefined}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050B18] text-[#F8F9FA] overflow-hidden ${
            !hasStarted ? 'cursor-pointer select-none' : ''
          }`}
        >
          {/* Native Video - Muted to let Sounds.mp3 handle all audio */}
          {!videoError ? (
            <video
              ref={videoRef}
              playsInline
              preload="auto"
              muted
              autoPlay={false}
              onEnded={handleEnter}
              onError={() => setVideoError(true)}
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src={`${import.meta.env.BASE_URL}intro.mp4`} type="video/mp4" />
              <source src={`${import.meta.env.BASE_URL}Intro.mp4`} type="video/mp4" />
            </video>
          ) : (
            /* Fallback luxury visual if intro.mp4 is missing */
            <div className="absolute inset-0 w-full h-full bg-marble-texture flex flex-col items-center justify-center p-6 text-center z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/60 via-transparent to-[#050B18]" />
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-[#D4AF37]/30 flex items-center justify-center relative bg-[#0B152C]/40 backdrop-blur-md mb-8 shadow-2xl">
                <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-[#D4AF37]/50 flex items-center justify-center">
                  <span className="font-cinzel text-4xl sm:text-5xl text-[#D4AF37] tracking-widest font-bold">
                    F & S
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Minimal Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/80 via-black/20 to-[#050B18]/40 z-10 pointer-events-none" />

          {/* Initial Clean Editorial Text Overlay (Before Tap) */}
          <AnimatePresence>
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-2xl"
              >
                <h1 className="font-cormorant text-5xl sm:text-7xl md:text-8xl font-light tracking-wide text-white mb-2 drop-shadow-md">
                  Farah <span className="font-cinzel text-[#D4AF37] italic">&</span> Seif
                </h1>

                <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] text-[#E5C158] uppercase mb-12 drop-shadow">
                  Santorini, Greece • September 18, 2027
                </p>

                {/* Subtle text prompt */}
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="font-cinzel text-xs sm:text-sm tracking-[0.35em] text-white/90 uppercase drop-shadow-lg"
                >
                  Click to open
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal Skip Button During Video Playback */}
          {hasStarted && (
            <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/40 text-xs font-cinzel tracking-widest text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-all backdrop-blur-md shadow-lg uppercase cursor-pointer"
              >
                <span>Skip</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
