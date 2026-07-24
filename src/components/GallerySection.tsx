import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, User, Calendar, Download, RefreshCw } from 'lucide-react';
import { fetchPhotos } from '../lib/supabase';
import { PhotoItem } from '../types';

interface GallerySectionProps {
  newPhotoTrigger?: PhotoItem | null;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ newPhotoTrigger }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    const data = await fetchPhotos();
    setPhotos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (newPhotoTrigger) {
      setPhotos((prev) => [newPhotoTrigger, ...prev.filter((p) => p.id !== newPhotoTrigger.id)]);
    }
  }, [newPhotoTrigger]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, photos]);

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : (prev as number) - 1));
  };

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : (prev as number) + 1));
  };

  const activePhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  return (
    <section id="gallery" className="py-28 bg-[#050B18] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Refresh Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16 text-center sm:text-left gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Memories In Greece</span>
            </div>
            <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
              Wedding <span className="font-cinzel text-[#D4AF37] italic">Gallery</span>
            </h2>
          </div>

          <button
            onClick={loadGallery}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-wider uppercase hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Gallery
          </button>
        </div>

        {/* Masonry Photo Grid */}
        {loading && photos.length === 0 ? (
          <div className="py-20 text-center font-cinzel text-xs text-[#E5C158] uppercase tracking-widest animate-pulse">
            Loading Wedding Album...
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx % 6) * 0.05 }}
                onClick={() => setActivePhotoIndex(idx)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#0B152C] group cursor-pointer shadow-lg hover:border-[#D4AF37]/60 transition-all duration-300"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Wedding Photo'}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/90 via-[#050B18]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <span className="font-cormorant text-lg text-white font-medium line-clamp-1">
                    {photo.caption || 'Greek Wedding Memories'}
                  </span>
                  <span className="font-cinzel text-[10px] text-[#E5C158] tracking-widest uppercase flex items-center gap-1">
                    <User className="w-3 h-3" /> {photo.uploader_name || 'Guest'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {activePhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#050B18]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors z-50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors z-50 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0B152C]/80 border border-[#D4AF37]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors z-50 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Central Lightbox Image Box */}
              <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative">
                <motion.img
                  key={activePhoto.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={activePhoto.url}
                  alt={activePhoto.caption || 'Wedding Photo'}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl border border-[#D4AF37]/40 shadow-2xl object-contain"
                />

                {/* Photo Info Bar */}
                <div className="mt-4 text-center space-y-1">
                  <h4 className="font-cormorant text-2xl text-white font-medium">
                    {activePhoto.caption || 'Santorini Wedding Moment'}
                  </h4>
                  <div className="flex items-center justify-center gap-4 text-xs font-cinzel text-[#E5C158] tracking-widest uppercase">
                    <span>Uploaded by: {activePhoto.uploader_name || 'Guest'}</span>
                    <span>•</span>
                    <a
                      href={activePhoto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gray-300 hover:text-[#E5C158] underline"
                    >
                      <Download className="w-3.5 h-3.5" /> High Res
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
