import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield } from 'lucide-react';

interface NavigationProps {
  onOpenOrganizer: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenOrganizer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Our Story', href: '#story' },
    { name: 'Venue & Travel', href: '#venue' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'Photo Gallery', href: '#gallery' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-3 bg-[#050B18]/85 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'py-6 bg-gradient-to-b from-[#050B18]/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-white group-hover:text-[#E5C158] transition-colors">
              Farah <span className="text-[#D4AF37] font-serif italic">&</span> Seif
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-cinzel text-xs tracking-[0.2em] uppercase text-gray-300 hover:text-[#E5C158] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions: Organizer Lock & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Organizer Hidden Login */}
            <button
              onClick={onOpenOrganizer}
              title="Organizer Portal"
              className="p-2.5 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/30 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/30 text-[#E5C158]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#050B18]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:hidden"
          >
            <div className="flex flex-col items-center space-y-8 text-center">
              <span className="font-cinzel text-2xl font-bold tracking-widest text-[#E5C158] mb-4">
                F <span className="italic font-serif">&</span> S
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-cinzel text-lg tracking-[0.25em] uppercase text-white hover:text-[#E5C158] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-8 border-t border-[#D4AF37]/20 w-48 flex justify-center">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrganizer();
                  }}
                  className="flex items-center gap-2 font-cinzel text-xs tracking-widest text-[#E5C158] uppercase"
                >
                  <Shield className="w-4 h-4" />
                  Organizer Portal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
