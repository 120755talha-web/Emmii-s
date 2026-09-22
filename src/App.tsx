import React, { useState, useEffect, useRef } from 'react';
import { BIRTHDAY_DATA } from './config/birthdayData';
import { Moment, BirthdayDataConfig } from './types';
import { getAllCustomPhotos } from './utils/photoStorage';
import { getPersistentBirthdayData } from './utils/contentStorage';
import { birthdaySynth } from './utils/synthesizer';

// Component imports
import { LoadingScreen } from './components/LoadingScreen';
import { FloatingParticles } from './components/FloatingParticles';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhotoMemoriesSection } from './components/PhotoMemoriesSection';
import { BirthdayLetterSection } from './components/BirthdayLetterSection';
import { TenMomentsSection } from './components/TenMomentsSection';
import { ScrapbookSection } from './components/ScrapbookSection';
import { SurpriseGiftSection } from './components/SurpriseGiftSection';
import { MusicSection } from './components/MusicSection';
import { FloatingMusicWidget } from './components/FloatingMusicWidget';
import { FinalCinematicSection } from './components/FinalCinematicSection';
import { PhotoCollageEnding } from './components/PhotoCollageEnding';
import { LightboxModal } from './components/LightboxModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [data, setData] = useState<BirthdayDataConfig>(BIRTHDAY_DATA);
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [selectedLightboxMoment, setSelectedLightboxMoment] = useState<Moment | null>(null);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [useSynth, setUseSynth] = useState(true);
  const [musicActivated, setMusicActivated] = useState(false);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load photos from Server & IndexedDB
  const refreshPhotos = async () => {
    const stored = await getAllCustomPhotos();
    setCustomPhotos(stored);
  };

  useEffect(() => {
    refreshPhotos();
    const handleUpdate = () => refreshPhotos();
    window.addEventListener('emmi-photos-updated', handleUpdate);
    return () => window.removeEventListener('emmi-photos-updated', handleUpdate);
  }, []);

  // Load persistent writings and listen for real-time updates
  useEffect(() => {
    getPersistentBirthdayData().then((loaded) => {
      setData(loaded);
    });

    const handleContentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<BirthdayDataConfig>>;
      if (customEvent.detail) {
        setData((prev) => ({
          ...prev,
          ...customEvent.detail,
          birthdayLetter: {
            ...prev.birthdayLetter,
            ...(customEvent.detail.birthdayLetter || {}),
          },
        }));
      }
    };

    window.addEventListener('emmi-content-updated', handleContentUpdate);
    return () => window.removeEventListener('emmi-content-updated', handleContentUpdate);
  }, []);

  // Keyboard shortcut (Ctrl+E or Alt+P) to open album manager
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsPhotoManagerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Audio Element for MP3
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/audio/birthday-song.mp3');
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      audio.onerror = () => {
        // If MP3 fails to load, gracefully fall back to Web Audio Synthesizer
        setUseSynth(true);
      };

      return () => {
        audio.pause();
        birthdaySynth.pause();
      };
    }
  }, []);

  // Play / Pause toggle
  const togglePlay = () => {
    setMusicActivated(true);
    if (isPlaying) {
      if (useSynth) {
        birthdaySynth.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (useSynth) {
        birthdaySynth.play();
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // If browser prevents MP3, use synth
          setUseSynth(true);
          birthdaySynth.play();
        });
      }
      setIsPlaying(true);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (useSynth) {
      birthdaySynth.toggleMute();
    } else if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  // Volume change
  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (audioRef.current) {
      audioRef.current.volume = newVal;
    }
  };

  // Toggle between Synthesizer & MP3 file
  const toggleSynthMode = () => {
    const nextSynth = !useSynth;
    setUseSynth(nextSynth);
    if (isPlaying) {
      if (nextSynth) {
        audioRef.current?.pause();
        birthdaySynth.play();
      } else {
        birthdaySynth.pause();
        audioRef.current?.play().catch(() => {
          setUseSynth(true);
          birthdaySynth.play();
        });
      }
    }
  };

  // Upload Custom Audio
  const handleUploadAudio = (file: File) => {
    const url = URL.createObjectURL(file);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().then(() => {
        setUseSynth(false);
        setIsPlaying(true);
        setMusicActivated(true);
        setCustomAudioName(file.name);
      });
    }
  };

  // Scroll to Memories from Hero CTA
  const handleExploreClick = () => {
    const element = document.querySelector('#memories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A1D24] selection:bg-[#F3D7D7] selection:text-[#701A28] relative overflow-x-hidden font-sans">
      {/* 1. Elegant Loading Reveal Screen */}
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {/* 2. Floating Atmospheric Particles & Hearts */}
      <FloatingParticles />

      {/* 3. Top Navigation */}
      <Navbar
        onOpenMusic={() => {
          const el = document.querySelector('#music');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
        isMusicPlaying={isPlaying}
      />

      {/* 4. Full-screen Cinematic Hero Section */}
      <HeroSection
        data={data}
        customHeroPhoto={customPhotos['hero'] || customPhotos['moment_1']}
        onExploreClick={handleExploreClick}
      />

      {/* 5. Editorial Photo Memories Section */}
      <PhotoMemoriesSection
        moments={data.tenMoments}
        customPhotos={customPhotos}
        onSelectMoment={(moment) => setSelectedLightboxMoment(moment)}
      />

      {/* 6. Handwritten Birthday Letter Section */}
      <BirthdayLetterSection data={data} />

      {/* 7. Dedicated 10 Moments 10 Smiles Section */}
      <TenMomentsSection
        moments={data.tenMoments}
        customPhotos={customPhotos}
        onSelectMoment={(moment) => setSelectedLightboxMoment(moment)}
      />

      {/* 8. Scrapbook Keepsake Album Section */}
      <ScrapbookSection
        scrapbookItems={data.scrapbook}
        moments={data.tenMoments}
        customPhotos={customPhotos}
        onSelectMoment={(moment) => setSelectedLightboxMoment(moment)}
      />

      {/* 9. Interactive Surprise Gift Box Section */}
      <SurpriseGiftSection data={data} />

      {/* 10. Background Birthday Music Controller */}
      <MusicSection
        data={data}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        useSynth={useSynth}
        customAudioName={customAudioName}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onChangeVolume={handleVolumeChange}
        onToggleSynth={toggleSynthMode}
        onUploadAudio={handleUploadAudio}
      />

      {/* 11. Final Cinematic Full-screen Blessing */}
      <FinalCinematicSection
        data={data}
        strongestMoment={data.tenMoments[9] || data.tenMoments[0]}
        customPhoto={customPhotos['moment_10']}
      />

      {/* 12. Gentle Floating Photo Collage Ending */}
      <PhotoCollageEnding
        moments={data.tenMoments}
        customPhotos={customPhotos}
        onSelectMoment={(moment) => setSelectedLightboxMoment(moment)}
        onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
      />

      {/* 13. Persistent Corner Floating Music Status */}
      <FloatingMusicWidget
        activated={musicActivated}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />

      {/* 14. Interactive Photo Lightbox Modal */}
      <LightboxModal
        moment={selectedLightboxMoment}
        allMoments={data.tenMoments}
        customPhotos={customPhotos}
        onClose={() => setSelectedLightboxMoment(null)}
        onNavigate={(newMoment) => setSelectedLightboxMoment(newMoment)}
      />

      {/* 15. Photo & Writings Manager Modal */}
      <PhotoUploadModal
        isOpen={isPhotoManagerOpen}
        moments={data.tenMoments}
        customPhotos={customPhotos}
        birthdayData={data}
        onClose={() => setIsPhotoManagerOpen(false)}
        onPhotosUpdated={refreshPhotos}
        onContentUpdated={(newContent) => {
          setData((prev) => ({
            ...prev,
            ...newContent,
            birthdayLetter: {
              ...prev.birthdayLetter,
              ...(newContent.birthdayLetter || {}),
            },
          }));
        }}
      />
    </div>
  );
}
