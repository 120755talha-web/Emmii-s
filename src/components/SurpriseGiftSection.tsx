import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayDataConfig } from '../types';

interface SurpriseGiftSectionProps {
  data: BirthdayDataConfig;
}

export const SurpriseGiftSection: React.FC<SurpriseGiftSectionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { surpriseSection } = data;

  const handleOpenGift = () => {
    if (!isOpen) {
      setIsOpen(true);

      // Trigger multi-stage tasteful confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9777F', '#EADBB6', '#701A28', '#F3D7D7', '#FFFFFF'],
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          confetti({
            particleCount: 35,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D9777F', '#EADBB6', '#FCE7F3'],
            disableForReducedMotion: true,
          });
          confetti({
            particleCount: 35,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D9777F', '#EADBB6', '#FCE7F3'],
            disableForReducedMotion: true,
          });
        }, 300);
      } catch {
        // ignore
      }
    }
  };

  return (
    <section id="surprise" className="relative py-24 sm:py-32 bg-[#2D141A] text-white overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#701A28]/40 to-[#D9777F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4E8C1] text-xs font-sans font-semibold tracking-wider uppercase mb-3">
            <Gift className="w-3.5 h-3.5 text-[#F4E8C1]" />
            A Special Little Secret
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            {surpriseSection.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/80 max-w-md mx-auto">
            {surpriseSection.subtitle}
          </p>
        </div>

        {/* Gift Box Container */}
        <div className="relative flex flex-col items-center justify-center my-8">
          <motion.div
            className="cursor-pointer select-none"
            onClick={handleOpenGift}
            whileHover={{ scale: isOpen ? 1 : 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Animated 3D Gift Box Representation */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Floating Sparkles when closed */}
              {!isOpen && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                    className="absolute -inset-4 rounded-full border border-dashed border-[#F4E8C1]/30"
                  />
                  <Sparkles className="w-6 h-6 text-[#F4E8C1] absolute -top-3 -right-2 animate-bounce" />
                </>
              )}

              {/* Gift Box Body */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-[#8E2437] to-[#D9777F] shadow-2xl border border-white/30 flex items-center justify-center">
                {/* Gift Ribbon - Horizontal & Vertical */}
                <div className="absolute inset-y-0 w-8 bg-gradient-to-b from-[#F4E8C1] to-[#E5CCA0] shadow-sm" />
                <div className="absolute inset-x-0 h-8 bg-gradient-to-r from-[#F4E8C1] to-[#E5CCA0] shadow-sm" />

                {/* Animated Lid */}
                <motion.div
                  className="absolute -top-3 inset-x-[-6px] h-12 rounded-lg bg-gradient-to-r from-[#9E2A3F] to-[#E2858D] border border-white/40 shadow-lg flex items-center justify-center"
                  animate={isOpen ? { y: -70, opacity: 0.2, rotate: -15 } : { y: 0, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'backOut' }}
                >
                  {/* Ribbon Bow on top */}
                  <div className="absolute -top-6 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#F4E8C1] border border-white/50 shadow-md flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-[#701A28] text-[#701A28]" />
                    </div>
                  </div>
                </motion.div>

                {/* Center Icon */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  {isOpen ? (
                    <CheckCircle2 className="w-8 h-8 text-[#F4E8C1]" />
                  ) : (
                    <Gift className="w-8 h-8 text-[#F4E8C1]" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              id="open-gift-btn"
              onClick={handleOpenGift}
              disabled={isOpen}
              className={`px-8 py-3.5 rounded-full font-sans font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl flex items-center gap-2 mx-auto ${
                isOpen
                  ? 'bg-white/20 text-[#F4E8C1] cursor-default'
                  : 'bg-gradient-to-r from-[#F4E8C1] to-[#D9777F] text-[#52131D] hover:scale-105 hover:shadow-[#F4E8C1]/30 cursor-pointer'
              }`}
            >
              {isOpen ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{surpriseSection.openedButtonText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{surpriseSection.buttonText}</span>
                </>
              )}
            </button>
          </div>

          {/* Revealed Secret Message Card */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 max-w-2xl mx-auto w-full bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
              >
                {/* Floating hearts inside revealed message */}
                <div className="flex justify-center mb-4">
                  <span className="w-12 h-12 rounded-full bg-[#D9777F]/30 flex items-center justify-center text-[#F4E8C1]">
                    <Heart className="w-6 h-6 fill-[#D9777F] text-[#D9777F]" />
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F4E8C1] leading-relaxed mb-4">
                  "{surpriseSection.hiddenMessage}"
                </h3>

                <p className="font-sans text-sm sm:text-base text-white/90 font-light leading-relaxed">
                  {surpriseSection.subNote}
                </p>

                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-center gap-2 text-xs font-sans text-white/70">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4E8C1]" />
                  <span>Always in your corner, celebrating every step you take.</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F4E8C1]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
