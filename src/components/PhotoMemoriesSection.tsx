import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, Heart } from 'lucide-react';
import { Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface PhotoMemoriesSectionProps {
  moments: Moment[];
  customPhotos: Record<string, string>;
  onSelectMoment: (moment: Moment) => void;
}

export const PhotoMemoriesSection: React.FC<PhotoMemoriesSectionProps> = ({
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

  // Curate 5 moments for the editorial magazine/memory layout
  // Moment 1 (Cake), Moment 2 (Straw hat garden), Moment 4 (Balloons), Moment 5 (Gift), Moment 7 (Flowers)
  const featured = moments[0];
  const polaroid1 = moments[1];
  const polaroid2 = moments[3];
  const filmstrip1 = moments[4];
  const filmstrip2 = moments[6];

  return (
    <section id="memories" className="relative py-24 sm:py-32 bg-[#FAF7F2] overflow-hidden">
      {/* Subtle organic background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3D7D7]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#EADBB6]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3D7D7]/60 text-[#701A28] text-xs font-sans font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#D9777F]" />
            Editorial Collection
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#52131D] font-bold tracking-tight mb-4">
            A Little Collection of Beautiful Memories
          </h2>
          <p className="font-sans text-base text-[#7A4B54] font-normal leading-relaxed">
            Every snapshot holds a story, a laughter, and a moment that we will cherish forever.
          </p>
        </div>

        {/* Editorial Layout: Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Large Featured Photo (Col 1-7) */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 group cursor-pointer"
              onClick={() => onSelectMoment(featured)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#F3D7D7]/80">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F7EBE8]">
                  <img
                    src={getImageSrc(featured)}
                    alt={featured.title}
                    onError={() => handleImageError(featured.id)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gradient & Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D141A]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Caption & Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex items-end justify-between">
                    <div>
                      <span className="text-xs font-sans tracking-widest uppercase text-[#F4E8C1] font-semibold">
                        Featured Memory · {featured.numberStr}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
                        {featured.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-white/90 mt-1.5 line-clamp-2 max-w-md italic">
                        "{featured.quote}"
                      </p>
                    </div>
                    <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-[#701A28] transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Column: Overlapping Polaroids & Cards (Col 8-12) */}
          <div className="md:col-span-5 flex flex-col gap-8">
            {/* Polaroid 1 (Rotated) */}
            {polaroid1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="cursor-pointer transform hover:-rotate-1 transition-transform duration-300"
                onClick={() => onSelectMoment(polaroid1)}
              >
                <div className="bg-white p-4 pb-6 rounded-lg shadow-lg hover:shadow-xl border border-[#EFE5E0] rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative aspect-[4/4] rounded bg-[#F7EBE8] overflow-hidden mb-3">
                    <img
                      src={getImageSrc(polaroid1)}
                      alt={polaroid1.title}
                      onError={() => handleImageError(polaroid1.id)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-sans">
                      {polaroid1.numberStr}
                    </span>
                  </div>
                  <div className="text-center px-2">
                    <p className="font-handwriting text-xl text-[#52131D] font-bold">
                      {polaroid1.title}
                    </p>
                    <p className="font-sans text-xs text-[#7A4B54] mt-0.5 italic">
                      "{polaroid1.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Polaroid 2 (Opposite Rotation) */}
            {polaroid2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="cursor-pointer"
                onClick={() => onSelectMoment(polaroid2)}
              >
                <div className="bg-white p-4 pb-6 rounded-lg shadow-lg hover:shadow-xl border border-[#EFE5E0] -rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative aspect-[4/4] rounded bg-[#F7EBE8] overflow-hidden mb-3">
                    <img
                      src={getImageSrc(polaroid2)}
                      alt={polaroid2.title}
                      onError={() => handleImageError(polaroid2.id)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-sans">
                      {polaroid2.numberStr}
                    </span>
                  </div>
                  <div className="text-center px-2">
                    <p className="font-handwriting text-xl text-[#52131D] font-bold">
                      {polaroid2.title}
                    </p>
                    <p className="font-sans text-xs text-[#7A4B54] mt-0.5 italic">
                      "{polaroid2.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Film-Strip Styling Row */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#F3D7D7]" />
            <span className="text-xs font-sans tracking-widest text-[#7A4B54] uppercase font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#D9777F] fill-[#D9777F]" />
              Snapshot Strip
            </span>
            <div className="h-px flex-1 bg-[#F3D7D7]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[filmstrip1, filmstrip2].filter(Boolean).map((moment) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => onSelectMoment(moment)}
                className="group cursor-pointer bg-white rounded-xl p-3 border border-[#F3D7D7] shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row gap-4 items-center"
              >
                <div className="relative w-full sm:w-44 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-[#F7EBE8]">
                  <img
                    src={getImageSrc(moment)}
                    alt={moment.title}
                    onError={() => handleImageError(moment.id)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-[#701A28] text-white px-2 py-0.5 rounded text-[10px] font-sans font-bold">
                    {moment.numberStr}
                  </span>
                </div>
                <div className="flex-1 py-1">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#D9777F]">
                    {moment.tag}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#52131D] mt-0.5">
                    {moment.title}
                  </h4>
                  <p className="font-sans text-xs text-[#7A4B54] mt-2 line-clamp-3 italic">
                    "{moment.quote}"
                  </p>
                  <p className="text-[11px] font-sans text-[#701A28] font-medium mt-3 flex items-center gap-1 group-hover:underline">
                    View high resolution <Maximize2 className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
