import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvuszjcuvkycprbggweo.supabase.co';
const supabaseAnonKey = 'sb_publishable_xPvR3HkIozZaxNLxPCIRfw_dvljpvdV';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GallerySection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  // Fetch photos filtered specifically for 'greek-wedding' from 'guest_photos' table on mount
  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      const { data, error } = await supabase
        .from('guest_photos')
        .select('*')
        .eq('wedding_slug', 'greek-wedding')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching guest photos:', error.message);
      } else if (data) {
        setPhotos(data);
      }
    };

    fetchGalleryPhotos();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  // Continuous smooth auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || photos.length === 0) return;

    const scrollInterval = setInterval(() => {
      if (!isHovered && container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft - 5) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 1, behavior: 'auto' });
        }
      }
    }, 25);

    return () => clearInterval(scrollInterval);
  }, [isHovered, photos.length]);

  // Handle file upload to 'photos' bucket and insert into 'guest_photos' with wedding_slug = 'greek-wedding'
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Upload file to Supabase Storage Bucket ('photos')
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image to storage:', uploadError.message);
          continue;
        }

        // 2. Get Public URL
        const { data: publicURLData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        const publicUrl = publicURLData.publicUrl;
        
        // 3. Match table schema with exact wedding_slug 'greek-wedding'
        const newPhotoPayload = {
          url: publicUrl,
          caption: `Memory ${photos.length + 1}`,
          uploader_name: 'Guest',
          wedding_slug: 'greek-wedding',
        };

        // 4. Save to 'guest_photos' Table
        const { data: insertedData, error: insertError } = await supabase
          .from('guest_photos')
          .insert([newPhotoPayload])
          .select();

        if (insertError) {
          console.error('Error saving record to database:', insertError.message);
        } else if (insertedData && insertedData.length > 0) {
          setPhotos((prev) => [insertedData[0], ...prev]);
        }
      } catch (err) {
        console.error('Unexpected error during upload:', err);
      }
    }

    setUploading(false);
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
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#E5C158] transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading to Supabase...' : 'Upload Your Photos'}
          </button>
        </motion.div>

        {/* Sliding Gallery Container */}
        {photos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#D4AF37]/30 rounded-3xl bg-[#0B152C]/40">
            <Camera className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-4" />
            <p className="font-cinzel text-sm text-gray-400 tracking-widest">
              No photos uploaded yet. Click the button above to add your memories!
            </p>
          </div>
        ) : (
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
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
              className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 sm:px-4"
            >
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="min-w-[280px] sm:min-w-[340px] lg:min-w-[380px] h-[500px] sm:h-[600px] rounded-[32px] overflow-hidden glass-panel border border-[#D4AF37]/30 relative group/card flex-shrink-0 shadow-2xl bg-[#0B152C]/60 flex flex-col justify-end"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Wedding Memory'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105 filter brightness-95"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/20 to-transparent opacity-95 pointer-events-none" />

                  {/* Bottom Caption */}
                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-[10px] font-bold flex items-center justify-center">
                        ✨
                      </div>
                      <span className="text-xs font-cinzel text-[#E5C158] tracking-widest uppercase">
                        {photo.uploader_name ? `By ${photo.uploader_name}` : 'Wedding Gallery'}
                      </span>
                    </div>
                    <h4 className="font-cormorant text-2xl sm:text-3xl text-white font-medium mb-1">
                      {photo.caption || 'Our Memory'}
                    </h4>
                    <p className="font-sans text-xs text-gray-300 font-light line-clamp-1">
                      Celebrating love under the Greek sky ✨
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Swipe instruction hint */}
        <div className="text-center mt-6">
          <span className="font-cinzel text-[10px] tracking-widest text-gray-500 uppercase">
            ← Continuous auto-scrolling (Hover to pause) →
          </span>
        </div>
      </div>
    </section>
  );
};
