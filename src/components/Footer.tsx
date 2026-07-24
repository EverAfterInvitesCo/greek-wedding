import React from 'react';
import { motion } from 'motion/react';
import { Heart, Instagram, Facebook, Shield } from 'lucide-react';

// Custom TikTok SVG Icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525 0h3.08c.12 1.042.615 2.073 1.388 2.877c.848.88 2.007 1.396 3.227 1.43v3.242c-1.326-.035-2.62-.397-3.765-1.053v8.118c0 4.192-3.415 7.586-7.622 7.586c-4.208 0-7.622-3.394-7.622-7.586c0-4.192 3.414-7.586 7.622-7.586c.49 0 .977.046 1.45.137V10.5a4.34 4.34 0 0 0-1.45-.246c-2.392 0-4.331 1.916-4.331 4.28c0 2.363 1.939 4.279 4.331 4.279c2.392 0 4.332-1.916 4.332-4.279V0z" />
  </svg>
);

interface FooterProps {
  onOpenOrganizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrganizer }) => {
  return (
    <footer className="bg-[#050B18] text-white pt-20 pb-12 border-t border-[#D4AF37]/20 relative overflow-hidden">
      {/* Aegean Sea Floor Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-gradient-to-t from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
        {/* Names Monogram */}
        <div className="space-y-2">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-light">
            Farah <span className="font-cinzel text-[#D4AF37] italic">&</span> Seif
          </h2>
          <p className="font-cinzel text-xs text-[#E5C158] tracking-[0.3em] uppercase">
            Santorini, Greece • September 18, 2027
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          <motion.a
            href="https://www.instagram.com/_everafterinvites_/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-3 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-all shadow-md"
            title="Everafter Invites Instagram"
          >
            <Instagram className="w-5 h-5" />
          </motion.a>

          <motion.a
            href="https://www.facebook.com/profile.php?id=61591686334310"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-3 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-all shadow-md"
            title="Everafter Invites Facebook"
          >
            <Facebook className="w-5 h-5" />
          </motion.a>

          <motion.a
            href="https://www.tiktok.com/@_everafterinvites_"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-3 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-all shadow-md"
            title="Everafter Invites TikTok"
          >
            <TikTokIcon className="w-5 h-5" />
          </motion.a>
        </div>

        {/* Main Signature Branding Requirement */}
        <div className="pt-6 border-t border-[#D4AF37]/10 max-w-md mx-auto">
          <p className="font-cinzel text-xs text-gray-400 tracking-widest flex items-center justify-center gap-2">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" /> by{' '}
            <a
              href="https://www.instagram.com/_everafterinvites_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5C158] hover:underline font-semibold"
            >
              Everafterinvites
            </a>
          </p>
        </div>

        {/* Secret Organizer Link */}
        <div className="pt-2">
          <button
            onClick={onOpenOrganizer}
            className="text-[11px] font-cinzel text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-widest inline-flex items-center gap-1.5"
          >
            <Shield className="w-3 h-3" /> Organizer Access
          </button>
        </div>
      </div>
    </footer>
  );
};
