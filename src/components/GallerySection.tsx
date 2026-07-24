import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Santorini Sunset Engagement',
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      caption: 'Aegean Blue Moments',
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      caption: 'The Cliffs of Oia',
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden Hour Vows',
    },
    {
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      caption: 'Forever Together',
    },
  ];

  return (
    <section id="gallery" className="py-28 bg-[#050B18] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Captured Moments</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            Our <span className="font-cinzel text-[#D4AF37] italic">Gallery</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase">
            A glimpse into our journey & love story
          </p>
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
                className="min-w-[280px] sm:min-w-[380px] lg:min-w-[420px] h-[400px] sm:h-[480px] snap-center rounded-3xl overflow-hidden glass-panel border border-[#D4AF37]/30 relative group/card flex-shrink-0 shadow-2xl"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 filter brightness-90 group-hover/card:brightness-100"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />

                {/* Caption Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between transform transition-transform duration-500">
                  <div>
                    <span className="text-[10px] sm:text-xs font-cinzel text-[#E5C158] tracking-[0.2em] uppercase block mb-1">
                      Santorini 2027
                    </span>
                    <h4 className="font-cormorant text-xl sm:text-2xl text-white font-medium">
                      {photo.caption}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] backdrop-blur-md">
                    <Heart className="w-4 h-4 fill-[#D4AF37]/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Swipe instruction hint for mobile users */}
        <div className="text-center mt-6 md:hidden">
          <span className="font-cinzel text-[10px] tracking-widest text-gray-500 uppercase">
            ← Swipe horizontally to explore photos →
          </span>
        </div>
      </div>
    </section>
  );
};
