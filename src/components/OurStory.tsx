import React from 'react';
import { motion } from 'motion/react';
import { Heart, Compass, Sparkles, MapPin } from 'lucide-react';
import { StoryMilestone } from '../types';

export const OurStory: React.FC = () => {
  const milestones: StoryMilestone[] = [
    {
      year: 'CHAPTER I',
      title: 'The First Spark',
      location: 'Cairo, Egypt',
      description:
        'What began as a chance meeting among mutual friends quickly blossomed into hours of effortless laughter and shared dreams. From the very first conversation, Farah and Seif knew their paths were bound together.',
      imageUrl: `${import.meta.env.BASE_URL}hands.jpg`,
    },
    {
      year: 'CHAPTER II',
      title: 'Journeys Across the Mediterranean',
      location: 'European Summers',
      description:
        'Through sunlit travels, late-night talks under starry skies, and quiet moments that spoke louder than words, their love deepened into an unwavering partnership built on trust, warmth, and shared joy.',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    },
    {
      year: 'CHAPTER III',
      title: 'The Proposal at Sunset',
      location: 'Santorini, Greece',
      description:
        'As the Aegean sun dipped into golden waters over the whitewashed cliffs of Oia, Seif asked Farah for forever. Surrounded by the timeless beauty of the Greek Isles, she said yes.',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="story" className="py-28 bg-marble-texture relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Our Journey To Greece</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            How We <span className="font-cinzel text-[#D4AF37] italic">Met</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Editorial Story Layout */}
        <div className="space-y-24">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.9 }}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-12 lg:gap-16`}
              >
                {/* Image Box with Gold Frame */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-[#E5C158]/10 to-transparent blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#0B152C]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-[350px] sm:h-[450px] object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-cinzel tracking-widest text-[#E5C158] uppercase">
                      <span className="flex items-center gap-1.5 bg-[#050B18]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/20">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.year}</span>
                  </div>

                  <h3 className="font-cormorant text-3xl sm:text-4xl text-white font-medium leading-tight">
                    {item.title}
                  </h3>

                  <p className="font-sans text-gray-300 text-base sm:text-lg leading-relaxed font-light pt-2">
                    {item.description}
                  </p>

                  <div className="pt-4">
                    <span className="inline-block font-cormorant italic text-[#E5C158] text-lg">
                      — Farah & Seif
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
