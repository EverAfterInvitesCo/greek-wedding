import React from 'react';
import { motion } from 'motion/react';
import { Clock, Wine, Heart, Music, Utensils, Sparkles, Sunset } from 'lucide-react';
import { ScheduleEvent } from '../types';

export const WeddingSchedule: React.FC = () => {
  const scheduleEvents: ScheduleEvent[] = [
    {
      time: '05:00 PM',
      title: 'Guest Arrival & Welcome Cocktails',
      subtitle: 'Panorama Terrace',
      location: 'Canaves Oia Sunset Deck',
      description: 'Sip chilled Greek spritzes and artisanal wines while enjoying live acoustic violin and cello melodies.',
      iconName: 'wine',
    },
    {
      time: '06:15 PM',
      title: 'Sunset Vow Ceremony',
      subtitle: 'The Caldera Rim',
      location: 'Infinity Amphitheater',
      description: 'Farah and Seif exchange vows framed by the iconic Greek blue domes as the sun sets over the Aegean.',
      iconName: 'sunset',
    },
    {
      time: '07:15 PM',
      title: 'Aegean Sunset Cocktail Hour',
      subtitle: 'Olympias Courtyard',
      location: 'Pool Lounge',
      description: 'Gourmet Greek meze, fresh Mediterranean oysters, champagne toasts, and sunset photography.',
      iconName: 'heart',
    },
    {
      time: '08:30 PM',
      title: 'Royal Mediterranean Dinner',
      subtitle: 'The Grand Pavilion',
      location: 'Canaves Banquet Terrace',
      description: 'A five-course candlelit feast curated by Michelin-star chefs, featuring Greek seafood and wine pairings.',
      iconName: 'utensils',
    },
    {
      time: '10:00 PM',
      title: 'First Dance & Speeches',
      subtitle: 'Under The Aegean Stars',
      location: 'Main Ballroom Deck',
      description: 'Heartfelt family toasts followed by Farah & Seif’s magical first dance under sparkling fairy lights.',
      iconName: 'sparkles',
    },
    {
      time: '11:00 PM',
      title: 'Celebration Party & Fireworks',
      subtitle: 'Late Night Euphoria',
      location: 'The Caldera Club',
      description: 'International DJ set, custom signature cocktails, late-night bites, and a spectacular fireworks show.',
      iconName: 'music',
    },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'wine':
        return <Wine className="w-5 h-5" />;
      case 'sunset':
        return <Sunset className="w-5 h-5" />;
      case 'heart':
        return <Heart className="w-5 h-5" />;
      case 'utensils':
        return <Utensils className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="schedule" className="py-28 bg-marble-texture relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Order Of Events</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            Wedding <span className="font-cinzel text-[#D4AF37] italic">Schedule</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase">
            Saturday, September 18, 2027
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Gold Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20 -translate-x-1/2" />

          {/* Left Gold Line for Mobile */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20" />

          <div className="space-y-12 relative">
            {scheduleEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Card Content */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-8">
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl relative group hover:border-[#D4AF37]/60 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-cinzel text-xs font-bold text-[#D4AF37] tracking-widest uppercase px-3 py-1 rounded-full bg-[#0B152C] border border-[#D4AF37]/30">
                          {event.time}
                        </span>
                        <span className="font-sans text-[11px] text-gray-400 uppercase tracking-wider">
                          {event.subtitle}
                        </span>
                      </div>

                      <h3 className="font-cormorant text-2xl sm:text-3xl text-white font-medium my-2">
                        {event.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-3">
                        {event.description}
                      </p>

                      <div className="text-[11px] font-cinzel text-[#E5C158] tracking-wider uppercase">
                        📍 {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Central Node Icon */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0B152C] border-2 border-[#D4AF37] text-[#E5C158] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] z-10 my-4 md:my-0">
                    {getIcon(event.iconName)}
                  </div>

                  {/* Empty Spacer for layout balance */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
