import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Bookmark, Upload } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to manage photos so you can upload new ones dynamically
  const [photos, setPhotos] = useState([
    {
      url: '',
      caption: 'Our First Memory',
      likes: '1,248',
      comments: '42',
    },
    {
      url: '',
      caption: 'The Engagement',
      likes: '2,510',
      comments: '89',
    },
    {
      url: '',
      caption: 'Sunset in Santorini',
      likes: '3,892',
      comments: '156',
    },
    {
      url: '',
      caption: 'Aegean Horizons',
      likes: '951',
      comments: '24',
    },
    {
      url: '',
      caption: 'Forever Together',
      likes: '4,120',
      comments: '210',
    },
  ]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  // Auto-slide effect when component is in view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle local file selection
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file),
      caption: `Uploaded Memory ${photos.length + index + 1}`,
      likes: '1',
      comments: '0',
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  return (
    <section id="gallery" className="py-28 bg-[#050B18] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Upload Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Captured Moments</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light mb-4">
            Our <span className="font-cinzel text-[#D4AF37] italic">Moments</span>
          </h2>
          <p className="text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase mb-6">
            A glimpse into our journey & love story
          </p>

          {/* Hidden File Input & Upload Trigger Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#E5C158] transition-all shadow-lg cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Your Photos
          </button>
        </motion.div>

        {/* Sliding Gallery Container */}
        <div className="relative group">
          {/* Desktop Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0B152C]/90 border border-[#D4AF37]/40 text-[#D4AF37] items-center justify-center hover:bg-[#D4AF37] hover:text-[#050B18] transition-all shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0B152C]/90 border border-[#D4AF37]/40 text-[#D4AF37] items-center justify-center hover:bg-[#D4AF37] hover:text-[#050B18] transition-all shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontal Scroll Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-4"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="min-w-[280px] sm:min-w-[340px] lg:min-w-[380px] h-[500px] sm:h-[600px] snap-center rounded-[32px] overflow-hidden glass-panel border border-[#D4AF37]/30 relative group/card flex-shrink-0 shadow-2xl bg-[#0B152C]/60 flex flex-col justify-end"
              >
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105 filter brightness-95"
                  />
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#D4AF37]/30 m-4 rounded-2xl cursor-pointer hover:border-[#D4AF37] transition-colors bg-[#0B152C]/40"
                  >
                    <Upload className="w-10 h-10 text-[#D4AF37]/60 mb-3" />
                    <span className="font-cinzel text-xs text-[#D4AF37] tracking-widest uppercase">
                      Click to Upload Image
                    </span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/20 to-transparent opacity-95 pointer-events-none" />

                {/* Right Side Social Action Overlays */}
                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-20 text-white">
                  <button className="flex flex-col items-center gap-1 group/btn">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/btn:bg-[#D4AF37] group-hover/btn:text-[#050B18] transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-sans tracking-wider">{photo.likes}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1 group/btn">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/btn:bg-[#D4AF37] group-hover/btn:text-[#050B18] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-sans tracking-wider">{photo.comments}</span>
                  </button>

                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Caption */}
                <div className="relative z-10 p-6 sm:p-8 pr-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-[10px] font-bold flex items-center justify-center">
                      E
                    </div>
                    <span className="text-xs font-cinzel text-[#E5C158] tracking-widest uppercase">
                      EverAfter Invites
                    </span>
                  </div>
                  <h4 className="font-cormorant text-2xl sm:text-3xl text-white font-medium mb-1">
                    {photo.caption}
                  </h4>
                  <p className="font-sans text-xs text-gray-300 font-light line-clamp-1">
                    Celebrating love under the Greek sky ✨
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Swipe instruction hint */}
        <div className="text-center mt-6">
          <span className="font-cinzel text-[10px] tracking-widest text-gray-500 uppercase">
            ← Swipe horizontally or let it auto-play →
          </span>
        </div>
      </div>
    </section>
  );
};
