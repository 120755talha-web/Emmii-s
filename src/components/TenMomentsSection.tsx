import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, Heart } from 'lucide-react';
import { Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface TenMomentsSectionProps {
  moments: Moment[];
  customPhotos: Record<string, string>;
  onSelectMoment: (moment: Moment) => void;
}

export const TenMomentsSection: React.FC<TenMomentsSectionProps> = ({
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

  return (
    <section id="ten-moments" className="relative py-24 sm:py-32 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3D7D7] text-[#701A28] text-xs font-sans font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#D9777F]" />
            All 10 Original Photographs
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#52131D] font-bold tracking-tight mb-4">
            10 Moments, 10 Smiles
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#7A4B54] font-normal leading-relaxed">
            Ten cherished memories from Emmi's special birthday album. Click any photo to view in full detail.
          </p>
        </div>

        {/* Varied Grid of the 10 Moments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {moments.map((moment, index) => {
            // Give varied span styling to keep the grid dynamic and non-repetitive
            const isWide = index === 0 || index === 7;

            return (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                className={`group cursor-pointer ${isWide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                onClick={() => onSelectMoment(moment)}
              >
                <div className="h-full bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-400 border border-[#F3D7D7] flex flex-col justify-between">
                  {/* Photo Container */}
                  <div className={`relative w-full rounded-xl overflow-hidden bg-[#F7EBE8] mb-4 ${isWide ? 'aspect-[16/10] sm:aspect-[21/11]' : 'aspect-[4/5]'}`}>
                    <img
                      src={getImageSrc(moment)}
                      alt={moment.title}
                      onError={() => handleImageError(moment.id)}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Number Badge */}
                    <div className="absolute top-3 left-3 bg-[#701A28] text-white px-3 py-1 rounded-full text-xs font-serif font-bold tracking-widest shadow-md flex items-center gap-1.5">
                      <span>{moment.numberStr}</span>
                      <span className="text-white/60 font-sans text-[10px]">/ 10</span>
                    </div>

                    {/* Tag Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#52131D] px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider shadow-xs">
                      {moment.tag}
                    </div>

                    {/* Expand icon on hover */}
                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content & Quotes */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#52131D] group-hover:text-[#B94D62] transition-colors">
                          {moment.caption}
                        </h3>
                        <Heart className="w-4 h-4 text-[#D9777F]/60 group-hover:fill-[#D9777F] transition-all" />
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-[#7A4B54] line-clamp-2 mt-1 italic">
                        "{moment.quote}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#FAF7F2] flex items-center justify-between text-xs text-[#7A4B54]">
                      <span className="font-sans">Authentic Photo #{moment.id}</span>
                      <span className="font-sans font-medium text-[#701A28] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Open Lightbox →
                      </span>
                    </div>
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
