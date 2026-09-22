/**
 * Types for Emmi's Birthday Celebration Website
 */

export interface Moment {
  id: number;
  numberStr: string; // e.g., "01", "02"
  title: string;
  caption: string;
  quote: string;
  pdfPage: number;
  tag: string;
  sceneDescription: string;
  accentColor: string;
  photoUrl: string; // default URL or custom uploaded data
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface ScrapbookItem {
  id: string;
  momentId: number;
  title: string;
  note: string;
  tapeColor: string;
  rotation: number; // degrees e.g. -2, 3
  sticker?: string;
}

export interface BirthdayDataConfig {
  personName: string;
  shortName: string;
  mainTitle: string;
  subtitle: string;
  supportingLine: string;
  heroCta: string;
  birthdayLetter: {
    title: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signOff: string;
  };
  tenMoments: Moment[];
  scrapbook: ScrapbookItem[];
  surpriseSection: {
    title: string;
    subtitle: string;
    buttonText: string;
    openedButtonText: string;
    hiddenMessage: string;
    subNote: string;
  };
  finalSection: {
    heroTitle: string;
    blessing: string;
    loveNote: string;
    footerCredit: string;
  };
  musicConfig: {
    title: string;
    artist: string;
    description: string;
    defaultSrc: string;
  };
}
