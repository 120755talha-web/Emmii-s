import React, { useState, useEffect } from 'react';
import { Menu, X, Music, Sparkles, ImagePlus } from 'lucide-react';

interface NavbarProps {
  onOpenMusic: () => void;
  onOpenPhotoManager: () => void;
  isMusicPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMusic,
  onOpenPhotoManager,
  isMusicPlaying,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Memories', href: '#memories' },
    { label: 'Letter', href: '#letter' },
    { label: '10 Moments', href: '#ten-moments' },
    { label: 'Scrapbook', href: '#scrapbook' },
    { label: 'Surprise', href: '#surprise' },
    { label: 'Finale', href: '#finale' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#F3D7D7]/60'
          : 'py-5 bg-gradient-to-b from-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#701A28] to-[#D9777F] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <span
            className={`font-serif text-lg md:text-xl font-bold tracking-wide transition-colors ${
              scrolled ? 'text-[#52131D]' : 'text-white drop-shadow-md'
            }`}
          >
            Emmi's Birthday
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-sans font-medium transition-colors hover:text-[#D9777F] relative py-1 ${
                scrolled ? 'text-[#4A1D24]' : 'text-white/90 drop-shadow-sm'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Button */}
          <button
            id="nav-music-btn"
            onClick={onOpenMusic}
            title="Music Settings"
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-sans font-medium cursor-pointer ${
              isMusicPlaying
                ? 'bg-[#701A28] text-white shadow-md animate-pulse'
                : scrolled
                ? 'bg-[#FDFBF7] text-[#701A28] border border-[#F3D7D7] hover:bg-[#F3D7D7]'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Music Playing' : 'Play Music'}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-[#52131D] hover:bg-[#F3D7D7]' : 'text-white hover:bg-white/20'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#F3D7D7] px-6 py-4 shadow-xl space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2 text-base font-serif font-medium text-[#52131D] hover:text-[#D9777F] border-b border-[#FAF7F2]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMusic();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] text-[#701A28] text-sm font-medium flex items-center justify-center gap-2 border border-[#F3D7D7]"
            >
              <Music className="w-4 h-4" />
              {isMusicPlaying ? 'Background Music: Playing' : 'Play Birthday Song'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPhotoManager();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#701A28] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <ImagePlus className="w-4 h-4" />
              Manage / Add Original Photos
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
