import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface FloatingMusicWidgetProps {
  activated: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}

export const FloatingMusicWidget: React.FC<FloatingMusicWidgetProps> = ({
  activated,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}) => {
  if (!activated) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="floating-music-control"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#2D141A]/90 text-white backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl border border-white/20 select-none text-xs font-sans"
      >
        {/* Animated equalizer bars if playing */}
        <div className="flex items-center gap-0.5 h-3.5 w-4 justify-center">
          {isPlaying && !isMuted ? (
            <>
              <motion.span
                animate={{ height: ['4px', '14px', '6px'] }}
                transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                className="w-0.5 bg-[#F4E8C1] rounded-full"
              />
              <motion.span
                animate={{ height: ['12px', '4px', '14px'] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
                className="w-0.5 bg-[#D9777F] rounded-full"
              />
              <motion.span
                animate={{ height: ['6px', '12px', '4px'] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                className="w-0.5 bg-[#F4E8C1] rounded-full"
              />
            </>
          ) : (
            <Music className="w-3.5 h-3.5 text-white/70" />
          )}
        </div>

        {/* State Label */}
        <button
          onClick={onTogglePlay}
          className="font-medium hover:text-[#F4E8C1] transition-colors flex items-center gap-1.5"
          title={isPlaying ? 'Pause music' : 'Resume music'}
        >
          {isPlaying ? (
            isMuted ? (
              <span className="text-white/80">🔇 Muted</span>
            ) : (
              <span className="text-[#F4E8C1] font-semibold">🎵 Playing</span>
            )
          ) : (
            <span className="text-white/70">⏸ Paused</span>
          )}
        </button>

        {/* Play/Pause quick icon */}
        <button
          onClick={onTogglePlay}
          className="p-1 rounded-full hover:bg-white/20 text-white/80 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
        </button>

        {/* Mute quick icon */}
        <button
          onClick={onToggleMute}
          className="p-1 rounded-full hover:bg-white/20 text-white/80 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#D9777F]" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
