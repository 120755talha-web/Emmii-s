import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { ScrapbookItem, Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface ScrapbookSectionProps {
  scrapbookItems: ScrapbookItem[];
  moments: Moment[];
  customPhotos: Record<string, string>;
  onSelectMoment: (moment: Moment) => void;
}

export const ScrapbookSection: React.FC<ScrapbookSectionProps> = ({
  scrapbookItems,
  moments,
  customPhotos,
  onSelectMoment,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const getImageSrc = (moment: Moment) => {
    if (customPhotos[`moment_${moment.id}`]) {
      return customPhotos[`moment_${moment.id}`];
    }
    if (imageErrors[moment.id]) {
      return getMomentFallbackIllustration(moment.id);
    }
    return moment.photoUrl;
  };

  const handleImageError = (momentId: number) => {
    setImageErrors((prev) => ({ ...prev, [momentId]: true }));
  };

  const momentsById = new Map<number, Moment>();
  moments.forEach((m) => momentsById.set(m.id, m));

  return (
    <section id="scrapbook" className="relative py-24 sm:py-32 bg-[#F5EFE6] overflow-hidden">
      {/* Decorative scrap craft background subtle dots */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#701A28_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#D9C4B6] text-[#701A28] text-xs font-sans font-semibold tracking-wider uppercase mb-3 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#D9777F]" />
            Keepsake Album
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#52131D] font-bold tracking-tight mb-4">
            Memory Scrapbook Album
          </h2>
          <p className="font-sans text-base text-[#7A4B54] font-normal leading-relaxed">
            Pinned with love, taped memories, handwritten notes, and unforgettable birthday smiles.
          </p>
        </div>

        {/* Scrapbook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {scrapbookItems.map((item, idx) => {
            const moment = momentsById.get(item.momentId) || moments[0];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                style={{ transform: `rotate(${item.rotation}deg)` }}
                className="group relative bg-[#FDFBF7] p-5 pt-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#E8D9CD] hover:rotate-0 cursor-pointer"
                onClick={() => onSelectMoment(moment)}
              >
                {/* Washi Tape Graphic at Top */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 opacity-85 shadow-xs"
                  style={{
                    backgroundColor: item.tapeColor,
                    transform: `rotate(${item.rotation * -1.5}deg)`,
                    clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                  }}
                />

                {/* Sticker Decor */}
                {item.sticker && (
                  <span className="absolute -top-2 -right-2 text-2xl select-none filter drop-shadow-sm transform hover:scale-125 transition-transform">
                    {item.sticker}
                  </span>
                )}

                {/* Photo in Polar Frame */}
                <div className="relative aspect-[4/4] rounded-sm overflow-hidden bg-[#FAF7F2] border border-[#E2D5CC] shadow-inner mb-4">
                  <img
                    src={getImageSrc(moment)}
                    alt={item.title}
                    onError={() => handleImageError(moment.id)}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-sans">
                    Moment #{moment.numberStr}
                  </span>
                </div>

                {/* Handwritten Note Content */}
                <div className="px-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg font-bold text-[#52131D]">
                      {item.title}
                    </h3>
                    <Heart className="w-3.5 h-3.5 text-[#D9777F] fill-[#D9777F]/30" />
                  </div>
                  <p className="font-handwriting text-xl text-[#633A41] leading-snug">
                    {item.note}
                  </p>
                </div>

                {/* Subtle paper crease line */}
                <div className="mt-3 pt-2 border-t border-[#F0E6DE] flex justify-between items-center text-[10px] font-sans text-[#8C766D]">
                  <span>Scrapbook Memo</span>
                  <span className="text-[#701A28] font-medium group-hover:underline">Click to expand</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
