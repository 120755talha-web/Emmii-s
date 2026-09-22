import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleDismiss = () => {
    setVisible(false);
    onComplete();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#4A1D24] px-6 text-center select-none cursor-pointer"
        >
          {/* Subtle glowing ring background */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#F3D7D7] to-[#FCE7F3] blur-3xl opacity-60 animate-pulse pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative flex flex-col items-center max-w-md"
          >
            {/* Animated Heart / Flower Icon */}
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut'
                }}
                className="w-16 h-16 rounded-full bg-white/80 shadow-md border border-[#F3D7D7] flex items-center justify-center text-[#701A28]"
              >
                <Heart className="w-8 h-8 fill-[#D9777F] text-[#701A28]" />
              </motion.div>
              <Sparkles className="w-5 h-5 text-[#E29595] absolute -top-1 -right-2 animate-bounce" />
            </div>

            {/* Elegant Serif Text */}
            <h2 className="font-serif text-2xl md:text-3xl text-[#52131D] tracking-wide mb-2 font-normal">
              Preparing something special for Emmi...
            </h2>
            <p className="font-sans text-sm text-[#7A4B54] tracking-widest uppercase font-medium">
              A Personal Birthday Memory Book
            </p>

            {/* Subtle progress indicator */}
            <div className="w-48 h-1 bg-[#F0E4E1] rounded-full overflow-hidden mt-6">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D9777F] to-[#701A28]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
