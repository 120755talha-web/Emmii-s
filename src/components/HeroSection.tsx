import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayDataConfig } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface HeroSectionProps {
  data: BirthdayDataConfig;
  customHeroPhoto?: string | null;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  customHeroPhoto,
  onExploreClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const heroImageSrc = customHeroPhoto || (imageError ? getMomentFallbackIllustration(1) : getMomentFallbackIllustration(1));

  const handleCtaClick = () => {
    // Gentle soft burst of rose & gold hearts/particles
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#D9777F', '#EADBB6', '#F3D7D7', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }
    onExploreClick();
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#2D141A] text-white"
    >
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Emmi Birthday Celebration"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-all duration-1000 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Sophisticated dark-to-transparent gradient overlays ensuring readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D141A] via-[#2D141A]/50 to-black/60" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#2D141A]/30 to-[#2D141A]/90" />
      </div>

      {/* Decorative Golden Ambient Sparks */}
      <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full bg-[#EADBB6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-72 h-72 rounded-full bg-[#D9777F]/15 blur-3xl pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        {/* Elegant top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F4E8C1] text-xs sm:text-sm font-sans tracking-widest uppercase mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F4E8C1]" />
          <span>A Special Digital Memory Book</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F4E8C1]" />
        </motion.div>

        {/* Primary Title */}
        <motion.h1
          id="hero-main-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] max-w-3xl mb-4 drop-shadow-lg"
        >
          {data.mainTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          id="hero-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#F3D7D7] font-normal mb-3 tracking-wide"
        >
          {data.subtitle}
        </motion.p>

        {/* Supporting Line */}
        <motion.p
          id="hero-supporting-line"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-lg mb-10 font-light"
        >
          {data.supportingLine}
        </motion.p>

        {/* Premium Animated Button */}
        <motion.button
          id="hero-cta-button"
          onClick={handleCtaClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D9777F] via-[#B94D62] to-[#701A28] text-white font-sans text-base sm:text-lg font-semibold shadow-xl hover:shadow-[#D9777F]/30 transition-all duration-300 border border-white/20"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white/80 text-white" />
            <span>{data.heroCta}</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
        </motion.button>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 pointer-events-none"
      >
        <span className="text-[11px] font-sans tracking-widest uppercase">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};
