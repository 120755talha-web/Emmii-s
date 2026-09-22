import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, Upload, Radio } from 'lucide-react';
import { BirthdayDataConfig } from '../types';

interface MusicSectionProps {
  data: BirthdayDataConfig;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  useSynth: boolean;
  customAudioName: string | null;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onChangeVolume: (val: number) => void;
  onToggleSynth: () => void;
  onUploadAudio: (file: File) => void;
}

export const MusicSection: React.FC<MusicSectionProps> = ({
  data,
  isPlaying,
  isMuted,
  volume,
  useSynth,
  customAudioName,
  onTogglePlay,
  onToggleMute,
  onChangeVolume,
  onToggleSynth,
  onUploadAudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { musicConfig } = data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadAudio(e.target.files[0]);
    }
  };

  return (
    <section id="music" className="relative py-20 bg-[#FAF7F2] overflow-hidden border-t border-[#F3D7D7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#F3D7D7] relative overflow-hidden">
          {/* Subtle floral/music accent */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F3D7D7]/50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Track Info */}
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="relative">
                <motion.div
                  animate={isPlaying && !isMuted ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#701A28] to-[#D9777F] shadow-lg flex items-center justify-center text-white"
                >
                  <Music className="w-9 h-9" />
                </motion.div>
                {isPlaying && !isMuted && (
                  <Sparkles className="w-5 h-5 text-[#EADBB6] absolute -top-1 -right-1 animate-ping" />
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#D9777F] mb-1">
                  <span>{useSynth ? 'Acoustic Synthesized Melody' : 'Original Audio Track'}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#52131D]">
                  {customAudioName || musicConfig.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#7A4B54] mt-1 max-w-sm">
                  {musicConfig.description}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-3">
                {/* Main Play / Pause Button */}
                <button
                  id="music-play-button"
                  onClick={onTogglePlay}
                  className={`px-6 py-3 rounded-full font-sans font-semibold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md ${
                    isPlaying
                      ? 'bg-[#701A28] text-white hover:bg-[#52131D]'
                      : 'bg-gradient-to-r from-[#D9777F] to-[#701A28] text-white hover:scale-105'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pause Birthday Song</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>🎵 Play Birthday Music</span>
                    </>
                  )}
                </button>

                {/* Mute Toggle */}
                <button
                  onClick={onToggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  className="p-3 rounded-full bg-[#FAF7F2] text-[#701A28] hover:bg-[#F3D7D7] border border-[#F3D7D7] transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Volume Slider & Mode Toggle */}
              <div className="flex items-center gap-4 text-xs text-[#7A4B54]">
                <div className="flex items-center gap-2">
                  <span className="font-sans">Vol:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-20 accent-[#701A28] cursor-pointer"
                  />
                </div>

                {/* Switch between MP3 & Ambient Synth */}
                <button
                  onClick={onToggleSynth}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#F3D7D7] text-[#701A28] hover:bg-[#F3D7D7] transition-all"
                  title="Switch between synthesized acoustic melody and audio file"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{useSynth ? 'Use File Audio' : 'Use Lullaby Chimes'}</span>
                </button>

                {/* Upload Local Audio File */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#F3D7D7] text-[#701A28] hover:bg-[#F3D7D7] transition-all"
                  title="Choose your own MP3 or audio song file"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Song</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
