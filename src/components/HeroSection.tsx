import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, MapPin, Calendar, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      {!videoError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 scale-105"
        >
          <source src={`${import.meta.env.BASE_URL}Greek.mp4`} type="video/mp4" />
        </video>
      ) : (
        /* Fallback Santorini Sunset Canvas Background */
        <div className="absolute inset-0 w-full h-full bg-marble-texture z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050B18] via-[#0D1D3A]/70 to-[#18325A]/60" />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-3xl"
          />
        </div>
      )}

      {/* Dark Royal Blue Vignette and Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1F] via-[#060D1F]/40 to-[#060D1F]/70 z-10 pointer-events-none" />
      <div className="absolute inset-0 luxury-vignette z-10 pointer-events-none" />

      {/* Hero Central Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
        {/* Monogram Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0B152C]/70 border border-[#D4AF37]/40 backdrop-blur-md text-[#E5C158] font-cinzel text-xs tracking-[0.3em] uppercase mb-8 shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Greek Vacation Destination Wedding</span>
        </motion.div>

        {/* Main Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="font-cormorant text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white drop-shadow-2xl leading-none">
            Farah <span className="font-cinzel text-[#D4AF37] italic font-normal">&</span> Seif
          </h1>
        </motion.div>

        {/* Married Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="font-cinzel text-base sm:text-xl md:text-2xl text-gray-200 tracking-[0.25em] uppercase font-light mb-8 max-w-3xl"
        >
          Are Getting Married
        </motion.p>

        {/* Date & Location Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base font-cinzel text-[#E5C158] tracking-[0.2em] uppercase py-3 px-8 rounded-2xl bg-[#0B152C]/60 border border-[#D4AF37]/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Saturday, September 18, 2027</span>
          </div>
          <span className="hidden sm:inline text-[#D4AF37]/50">•</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>Santorini, Greece</span>
          </div>
        </motion.div>

        {/* RSVP Quick CTA */}
        <motion.a
          href="#rsvp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA820A] text-[#050B18] font-cinzel text-xs font-bold tracking-[0.25em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)] transition-all"
        >
          RSVP Today
        </motion.a>
      </div>

      {/* Animated Scroll Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
      >
        <a href="#countdown" className="flex flex-col items-center group">
          <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#E5C158]/80 uppercase group-hover:text-[#E5C158] transition-colors mb-1">
            Scroll To Discover
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="p-2 rounded-full border border-[#D4AF37]/30 bg-[#0B152C]/60 backdrop-blur-sm text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
