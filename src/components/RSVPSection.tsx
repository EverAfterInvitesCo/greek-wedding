import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, Users, Heart, Phone, Mail, User, Sparkles, Utensils } from 'lucide-react';
import { RSVP } from '../types';
import { submitRSVP } from '../lib/supabase';

export const RSVPSection: React.FC = () => {
  const [formData, setFormData] = useState<RSVP>({
    wedding_slug: 'greek-wedding',
    guest_name: '',
    phone_number: '',
    email: '',
    number_of_guests: 1,
    attendance: 'yes',
    dietary_notes: 'None',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const triggerGoldConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C158', '#FAF0CA', '#FFFFFF', '#0B152C'],
      });
    } catch (e) {
      // Ignore confetti errors if canvas unavailable
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.guest_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.phone_number.trim()) {
      setErrorMsg('Please provide a contact phone number.');
      return;
    }

    setLoading(true);

    const res = await submitRSVP(formData);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      triggerGoldConfetti();
    } else {
      setErrorMsg(res.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="rsvp" className="py-28 bg-[#050B18] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Kindly Respond By June 1, 2027</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            RSVP <span className="font-cinzel text-[#D4AF37] italic">Invitation</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase">
            We look forward to celebrating with you in Santorini
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-12 relative border border-[#D4AF37]/30 luxury-shadow">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Attendance Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: 'yes' })}
                    className={`p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      formData.attendance === 'yes'
                        ? 'bg-[#0B152C] border-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                        : 'bg-[#0B152C]/40 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-6 h-6 ${formData.attendance === 'yes' ? 'text-[#D4AF37]' : 'text-gray-500'}`}
                    />
                    <span className="font-cinzel text-sm font-semibold tracking-wider uppercase">
                      Joyfully Accepts
                    </span>
                    <span className="text-xs text-gray-400">I will attend the wedding in Greece</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: 'no' })}
                    className={`p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      formData.attendance === 'no'
                        ? 'bg-[#0B152C] border-gray-400 text-white shadow-md'
                        : 'bg-[#0B152C]/40 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <Heart className="w-6 h-6 text-gray-500" />
                    <span className="font-cinzel text-sm font-semibold tracking-wider uppercase">
                      Regretfully Declines
                    </span>
                    <span className="text-xs text-gray-400">Will be celebrating with you from afar</span>
                  </button>
                </div>

                {/* Inputs Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexander Wright"
                        value={formData.guest_name}
                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Inputs Row 2: Email & Guest Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="yourname@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                      Number of Guests Attending
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={formData.number_of_guests}
                        onChange={(e) => setFormData({ ...formData, number_of_guests: Number(e.target.value) })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-sm cursor-pointer"
                      >
                        <option value={1} className="bg-[#050B18]">1 Guest (Just Me)</option>
                        <option value={2} className="bg-[#050B18]">2 Guests (Me + Plus One)</option>
                        <option value={3} className="bg-[#050B18]">3 Guests</option>
                        <option value={4} className="bg-[#050B18]">4 Guests</option>
                        <option value={5} className="bg-[#050B18]">5 Guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dietary Requirements */}
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2 flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5" />
                    Dietary Requirements or Allergies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Gluten-Free, Seafood allergy, None"
                    value={formData.dietary_notes}
                    onChange={(e) => setFormData({ ...formData, dietary_notes: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                  />
                </div>

                {/* Personal Message */}
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                    Warm Wishes / Message to Farah & Seif
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share a message or song request for the Greek night..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA820A] text-[#050B18] font-cinzel text-sm font-bold tracking-[0.25em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Transmitting RSVP...' : 'Confirm RSVP'}
                  </button>
                </div>
              </motion.form>
            ) : (
              /* Success Confirmation Card */
              <motion.div
                key="rsvp-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-[#0B152C] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  <Sparkles className="w-10 h-10 animate-bounce" />
                </div>

                <h3 className="font-cormorant text-4xl sm:text-5xl text-white font-medium">
                  {formData.attendance === 'yes' ? 'We Can’t Wait To See You!' : 'Thank You For Your Response'}
                </h3>

                <p className="font-sans text-gray-300 text-base max-w-md mx-auto">
                  {formData.attendance === 'yes'
                    ? `Thank you, ${formData.guest_name}! Your response for ${formData.number_of_guests} guest(s) has been officially recorded.`
                    : `Thank you, ${formData.guest_name}. Your warm wishes have been sent to Farah & Seif.`}
                </p>

                <div className="p-6 rounded-2xl bg-[#0B152C]/90 border border-[#D4AF37]/30 max-w-md mx-auto text-left space-y-2 text-xs font-cinzel tracking-wider text-gray-300">
                  <div className="text-[#E5C158] font-semibold uppercase border-b border-[#D4AF37]/20 pb-2 mb-2">
                    RSVP Confirmation Voucher
                  </div>
                  <div>Guest: <span className="text-white font-medium">{formData.guest_name}</span></div>
                  <div>Status: <span className="text-[#D4AF37] font-medium uppercase">{formData.attendance === 'yes' ? 'Attending' : 'Declined'}</span></div>
                  <div>Party Size: <span className="text-white font-medium">{formData.number_of_guests} Person(s)</span></div>
                  <div>Phone: <span className="text-white font-medium">{formData.phone_number}</span></div>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      wedding_slug: 'greek-wedding',
                      guest_name: '',
                      phone_number: '',
                      email: '',
                      number_of_guests: 1,
                      attendance: 'yes',
                      dietary_notes: 'None',
                      message: '',
                    });
                  }}
                  className="px-8 py-3 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 text-[#E5C158] font-cinzel text-xs tracking-widest uppercase hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors"
                >
                  Submit Another RSVP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
