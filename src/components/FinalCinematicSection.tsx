import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { BirthdayDataConfig, Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface FinalCinematicSectionProps {
  data: BirthdayDataConfig;
  strongestMoment: Moment;
  customPhoto?: string | null;
}

export const FinalCinematicSection: React.FC<FinalCinematicSectionProps> = ({
  data,
  strongestMoment,
  customPhoto,
}) => {
  const [imageError, setImageError] = useState(false);
  const { finalSection } = data;

  const imageSrc =
    customPhoto ||
    (imageError ? getMomentFallbackIllustration(strongestMoment.id) : strongestMoment.photoUrl);

  return (
    <section
      id="finale"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1A0B10] text-white py-24 px-6"
    >
      {/* Background Photograph with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt={strongestMoment.title}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.1] scale-105"
        />
        {/* Cinematic rich dark-to-burgundy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B10] via-[#2D141A]/70 to-[#1A0B10]/80" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#1A0B10]/40 to-[#1A0B10]/95" />
      </div>

      {/* Golden & Rose ambient backlights */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#EADBB6]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#D9777F]/20 blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Soft floating heart */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 shadow-xl"
        >
          <Heart className="w-8 h-8 fill-[#D9777F] text-[#D9777F]" />
        </motion.div>

        {/* 1. Final Hero Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-xl"
        >
          {finalSection.heroTitle}
        </motion.h2>

        {/* 2. Blessing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#F4E8C1] mb-6 max-w-2xl font-light"
        >
          "{finalSection.blessing}"
        </motion.p>

        {/* 3. With lots of love */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-handwriting text-3xl sm:text-4xl text-[#F3D7D7] mb-8"
        >
          {finalSection.loveNote}
        </motion.p>

        {/* 4. Made especially for you */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-sans tracking-widest uppercase text-white/80"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EADBB6]" />
          <span>{finalSection.footerCredit}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EADBB6]" />
        </motion.div>
      </div>
    </section>
  );
};
