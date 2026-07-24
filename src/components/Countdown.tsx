import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Heart } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC = () => {
  const WEDDING_DATE = new Date('2027-09-18T17:00:00+03:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = WEDDING_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-24 bg-[#050B18] relative overflow-hidden">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Counting Down To Forever</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-white font-light">
            Until We Say <span className="font-cinzel text-[#D4AF37] italic">"I Do"</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-wider uppercase">
            September 18, 2027 • Oia, Santorini, Greece
          </p>
        </motion.div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {timeBlocks.map((block, idx) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="glass-panel rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <motion.div
                key={block.value}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold gold-gradient-text mb-2 tracking-tight"
              >
                {String(block.value).padStart(2, '0')}
              </motion.div>

              <div className="font-cinzel text-xs sm:text-sm tracking-[0.25em] text-gray-300 uppercase font-medium">
                {block.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 text-center flex justify-center items-center gap-2 text-xs sm:text-sm font-cormorant italic text-gray-400"
        >
          <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>"In all the world, there is no heart for me like yours."</span>
        </motion.div>
      </div>
    </section>
  );
};
