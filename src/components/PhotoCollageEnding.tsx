import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, PenLine, ShieldCheck } from 'lucide-react';
import { Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface PhotoCollageEndingProps {
  moments: Moment[];
  customPhotos: Record<string, string>;
  onSelectMoment: (moment: Moment) => void;
  onOpenPhotoManager?: () => void;
}

export const PhotoCollageEnding: React.FC<PhotoCollageEndingProps> = ({
  moments,
  customPhotos,
  onSelectMoment,
  onOpenPhotoManager,
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

  // Select 5 moments for a balanced, uncrowded, gentle floating collage
  const collageMoments = [
    { moment: moments[0], rot: -3, yOffset: 0 },
    { moment: moments[2], rot: 2, yOffset: -12 },
    { moment: moments[4], rot: -2, yOffset: 8 },
    { moment: moments[7], rot: 3, yOffset: -8 },
    { moment: moments[9], rot: -1.5, yOffset: 4 },
  ];

  return (
    <section className="relative py-20 bg-[#FAF7F2] overflow-hidden border-t border-[#F3D7D7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Subtle heading */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-4 h-4 text-[#D9777F] fill-[#D9777F]" />
          <span className="text-xs font-sans tracking-widest text-[#7A4B54] uppercase font-semibold">
            Snapshot Memory Collage
          </span>
          <Heart className="w-4 h-4 text-[#D9777F] fill-[#D9777F]" />
        </div>

        {/* Floating Collage Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-6">
          {collageMoments.map(({ moment, rot, yOffset }, idx) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [yOffset, yOffset - 6, yOffset],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
              onClick={() => onSelectMoment(moment)}
              style={{ transform: `rotate(${rot}deg)` }}
              className="cursor-pointer bg-white p-2.5 pb-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#F3D7D7] w-36 sm:w-44 md:w-48"
            >
              <div className="aspect-[4/4] rounded-lg overflow-hidden bg-[#F7EBE8] mb-2">
                <img
                  src={getImageSrc(moment)}
                  alt={moment.title}
                  onError={() => handleImageError(moment.id)}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="font-handwriting text-base text-[#52131D] truncate px-1">
                {moment.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final Ending Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-14"
        >
          <div className="inline-block px-8 py-3.5 rounded-full bg-white shadow-md border border-[#F3D7D7]">
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#701A28] font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D9777F]" />
              <span>✨ The End of Your Little Birthday Story ✨</span>
              <Sparkles className="w-5 h-5 text-[#D9777F]" />
            </p>
          </div>
          <p className="font-sans text-xs text-[#7A4B54] mt-4">
            Forever loved, forever cherished. Happy Birthday Emmi!
          </p>

          {onOpenPhotoManager && (
            <div className="mt-8 pt-6 border-t border-[#F3D7D7]/70 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="footer-album-manager-btn"
                onClick={onOpenPhotoManager}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-[#FAF7F2] text-[#701A28] border border-[#F3D7D7] hover:border-[#701A28] text-xs font-sans font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <PenLine className="w-3.5 h-3.5 text-[#D9777F]" />
                <span>Personalize Photos & Letter</span>
              </button>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#7A4B54] font-sans">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Server & Browser permanent storage enabled</span>
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
