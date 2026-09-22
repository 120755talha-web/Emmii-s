import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { Moment } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

interface LightboxModalProps {
  moment: Moment | null;
  allMoments: Moment[];
  customPhotos: Record<string, string>;
  onClose: () => void;
  onNavigate: (newMoment: Moment) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  moment,
  allMoments,
  customPhotos,
  onClose,
  onNavigate,
}) => {
  const [imageError, setImageError] = useState(false);

  const currentIndex = moment ? allMoments.findIndex((m) => m.id === moment.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setImageError(false);
      onNavigate(allMoments[currentIndex - 1]);
    } else if (currentIndex === 0) {
      setImageError(false);
      onNavigate(allMoments[allMoments.length - 1]);
    }
  }, [currentIndex, allMoments, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < allMoments.length - 1) {
      setImageError(false);
      onNavigate(allMoments[currentIndex + 1]);
    } else if (currentIndex === allMoments.length - 1) {
      setImageError(false);
      onNavigate(allMoments[0]);
    }
  }, [currentIndex, allMoments, onNavigate]);

  // Keyboard navigation (Arrow keys & Escape)
  useEffect(() => {
    if (!moment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moment, onClose, handlePrev, handleNext]);

  if (!moment) return null;

  const imageSrc =
    customPhotos[`moment_${moment.id}`] ||
    (imageError ? getMomentFallbackIllustration(moment.id) : moment.photoUrl);

  return (
    <AnimatePresence>
      <motion.div
        id="photo-lightbox-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10 select-none"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
          aria-label="Close photo"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Modal Center Content */}
        <motion.div
          key={moment.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center bg-[#1A0B10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Photo (Never distorted, preserving full aspect ratio) */}
          <div className="relative w-full max-h-[65vh] sm:max-h-[70vh] flex items-center justify-center bg-black/60 overflow-hidden">
            <img
              src={imageSrc}
              alt={moment.title}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="max-h-[65vh] sm:max-h-[70vh] w-auto max-w-full object-contain"
            />
          </div>

          {/* Caption & Details Footer */}
          <div className="w-full p-4 sm:p-6 bg-[#251017] text-white border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#701A28] text-white text-xs font-serif font-bold">
                  {moment.numberStr} / 10
                </span>
                <span className="text-xs font-sans text-[#EADBB6] tracking-wider uppercase font-semibold">
                  {moment.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {moment.caption}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/80 mt-1 italic">
                "{moment.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#D9777F] fill-[#D9777F]" />
                Emmi's Memories
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#EADBB6]" />
                Original Photo
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
