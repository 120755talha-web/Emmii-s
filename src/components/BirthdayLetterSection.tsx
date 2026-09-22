import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { BirthdayDataConfig } from '../types';

interface BirthdayLetterSectionProps {
  data: BirthdayDataConfig;
}

export const BirthdayLetterSection: React.FC<BirthdayLetterSectionProps> = ({ data }) => {
  const { birthdayLetter } = data;

  return (
    <section id="letter" className="relative py-24 sm:py-32 bg-[#F7EBE8]/60 overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F3D7D7] to-[#FAF7F2] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#F3D7D7] text-[#701A28] text-xs font-sans font-semibold tracking-wider uppercase mb-3 shadow-xs">
            <Heart className="w-3 h-3 text-[#D9777F] fill-[#D9777F]" />
            From The Heart
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#52131D] font-bold tracking-tight">
            {birthdayLetter.title}
          </h2>
        </div>

        {/* The Handwritten / Parchment Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#FDFBF7] rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl border border-[#EFE5E0] overflow-hidden"
        >
          {/* Subtle paper texture overlay & margin line */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-px bg-[#F3D7D7]/70 pointer-events-none" />
          
          {/* Top Wax Seal Stamp Decor */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#701A28] shadow-md border-2 border-[#8E2437] flex items-center justify-center text-white/90 transform rotate-12">
              <span className="font-serif text-lg font-bold">E</span>
            </div>
          </div>

          <div className="pl-6 sm:pl-10">
            {/* Salutation */}
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-handwriting text-3xl sm:text-4xl text-[#701A28] font-bold mb-6"
            >
              {birthdayLetter.salutation}
            </motion.h3>

            {/* Paragraphs with Staggered Reveal */}
            <div className="space-y-5 text-base sm:text-lg md:text-xl text-[#3D2529] font-sans font-normal leading-relaxed">
              {birthdayLetter.paragraphs.map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Closing */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 pt-6 border-t border-[#F3D7D7]"
            >
              <p className="font-serif italic text-xl sm:text-2xl text-[#701A28] font-semibold">
                {birthdayLetter.closing}
              </p>
              <p className="font-handwriting text-2xl text-[#7A4B54] mt-3">
                {birthdayLetter.signOff}
              </p>
            </motion.div>
          </div>

          {/* Little spark decorative icon */}
          <Sparkles className="w-6 h-6 text-[#D9777F]/40 absolute bottom-6 right-8" />
        </motion.div>
      </div>
    </section>
  );
};
