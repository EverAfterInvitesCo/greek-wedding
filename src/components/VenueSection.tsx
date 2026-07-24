import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Plane, Hotel, Shirt, Calendar, ExternalLink } from 'lucide-react';

export const VenueSection: React.FC = () => {
  const googleMapsUrl = 'https://maps.google.com/?q=Canaves+Oia+Resort+Santorini+Greece';

  return (
    <section id="venue" className="py-28 bg-[#050B18] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

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
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Destination Details</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            The <span className="font-cinzel text-[#D4AF37] italic">Venue</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase">
            Canaves Oia Luxury Resort • Santorini, Greece
          </p>
        </motion.div>

        {/* Venue Hero Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column: Image & Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel tracking-widest text-[#D4AF37] uppercase mb-3">
                <Compass className="w-4 h-4" />
                <span>Primary Celebration Grounds</span>
              </div>
              <h3 className="font-cormorant text-3xl sm:text-5xl text-white font-medium mb-4">
                Canaves Oia Luxury Resort
              </h3>
              <p className="font-sans text-gray-300 text-base sm:text-lg leading-relaxed font-light mb-6">
                Carved into the volcanic cliffs of Oia overlooking the infinite blue of the Aegean Sea, Canaves Oia
                offers an enchanting setting where sea breezes and golden sunsets set the stage for our wedding vows.
              </p>

              <div className="space-y-3 font-cinzel text-xs sm:text-sm text-gray-300 tracking-wider">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <span>Main Street, Oia 847 02, Santorini Island, Cyclades, Greece</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Saturday, September 18, 2027 • 5:00 PM EEST</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#D4AF37]/20 flex flex-wrap gap-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#E5C158] transition-colors shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                Get Directions (Google Maps)
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Embedded Map Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 glass-panel rounded-3xl overflow-hidden relative min-h-[350px] border border-[#D4AF37]/30 flex flex-col"
          >
            <div className="p-4 bg-[#0B152C] border-b border-[#D4AF37]/20 flex items-center justify-between">
              <span className="font-cinzel text-xs tracking-widest text-[#E5C158] uppercase flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                Interactive Location Preview
              </span>
              <span className="text-[10px] text-gray-400 font-sans">Santorini 84702</span>
            </div>

            <div className="relative flex-1 w-full min-h-[300px]">
              <iframe
                title="Canaves Oia Resort Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3215.938830847761!2d25.3752520764126!3d36.46261597234479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDI3JzA1LjQiTiAyNcKwMjInMzkuMiJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                className="absolute inset-0 w-full h-full border-0 filter contrast-125 saturate-75 opacity-90"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/20 rounded-b-3xl" />
            </div>
          </motion.div>
        </div>

        {/* Travel & Guest Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Flight & Travel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6">
              <Plane className="w-5 h-5" />
            </div>
            <h4 className="font-cormorant text-2xl text-white font-medium mb-2">Flights & Ferries</h4>
            <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
              Fly directly into <strong>Santorini Thira National Airport (JTR)</strong> via direct European charters or
              a quick 45-min flight from Athens (ATH). High-speed ferries from Piraeus are also available.
            </p>
            <span className="font-cinzel text-[11px] text-[#E5C158] tracking-wider uppercase">
              Airport code: JTR
            </span>
          </motion.div>

          {/* Card 2: Accommodations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6">
              <Hotel className="w-5 h-5" />
            </div>
            <h4 className="font-cormorant text-2xl text-white font-medium mb-2">Accommodations</h4>
            <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
              We have arranged room blocks at <strong>Canaves Oia Suites</strong> and nearby luxury boutique hotels in
              Oia & Imerovigli. Mention "Farah & Seif Wedding" when booking.
            </p>
            <span className="font-cinzel text-[11px] text-[#E5C158] tracking-wider uppercase">
              Special guest rates
            </span>
          </motion.div>

          {/* Card 3: Dress Code */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-6">
              <Shirt className="w-5 h-5" />
            </div>
            <h4 className="font-cormorant text-2xl text-white font-medium mb-2">Dress Code</h4>
            <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
              <strong>Black Tie & Royal Aegean Elegance</strong>. Gentlemen: Tuxedos or dark suits. Ladies: Floor-length
              gowns in regal jewel tones, deep blue, gold, or champagne.
            </p>
            <span className="font-cinzel text-[11px] text-[#E5C158] tracking-wider uppercase">
              Sunset Elegance
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
