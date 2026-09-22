/**
 * =========================================================================
 *  EMMI'S BIRTHDAY CONFIGURATION & EDITABLE CONTENT
 * =========================================================================
 * 
 * You can easily customize any text, message, caption, or settings below.
 * Everything here automatically reflects across the entire website.
 */

import { BirthdayDataConfig } from '../types';
import { getMomentFallbackIllustration } from '../utils/photoStorage';

export const BIRTHDAY_DATA: BirthdayDataConfig = {
  // -----------------------------------------------------------------------
  // 1. RECIPIENT & HERO HEADLINES
  // -----------------------------------------------------------------------
  personName: "NOUSHIN JAHAN EMMI",
  shortName: "Emmi",
  mainTitle: "Happy Birthday to NOUSHIN JAHAN EMMI",
  subtitle: "My beloved little sister.",
  supportingLine: "Today is all about celebrating you. ❤️",
  heroCta: "Open Your Birthday Surprise ✨",

  // -----------------------------------------------------------------------
  // 2. HEARTFELT BIRTHDAY LETTER (Requirement #8)
  // -----------------------------------------------------------------------
  birthdayLetter: {
    title: "A Little Message For You 💌",
    salutation: "Happy Birthday, Emmi!",
    paragraphs: [
      "You are not just my little sister, but one of the most precious people in my life.",
      "I hope this new year of your life brings you endless happiness, beautiful memories, countless reasons to smile, and everything your heart wishes for.",
      "Always keep smiling, keep dreaming, and keep being the wonderful person you are."
    ],
    closing: "Happy Birthday once again. ❤️",
    signOff: "With endless love & blessings, Your Brother"
  },

  // -----------------------------------------------------------------------
  // 3. THE 10 MOMENTS (Requirement #9 & #1)
  // Matching the 10 original photographs from the authoritative source PDF
  // -----------------------------------------------------------------------
  tenMoments: [
    {
      id: 1,
      numberStr: "01",
      title: "That Beautiful Smile",
      caption: "01 — That Beautiful Smile",
      quote: "May your dreams become your reality, pretty girl. You deserve all the happiness in the world. Stay happy, keep shining always ♡",
      pdfPage: 10,
      tag: "Candlelight Wishes",
      sceneDescription: "Smiling behind the pink floral birthday cake with glowing candles and balloons.",
      accentColor: "#E29595",
      photoUrl: getMomentFallbackIllustration(1),
      aspect: "portrait"
    },
    {
      id: 2,
      numberStr: "02",
      title: "A Precious Moment",
      caption: "02 — A Precious Moment",
      quote: "You're not just my little sister, you're my pride, my joy and my biggest blessing. ♡",
      pdfPage: 12,
      tag: "Nature & Sunshine",
      sceneDescription: "Wearing the woven conical straw hat in the sunlit green garden with vibrant magenta dupatta.",
      accentColor: "#A36868",
      photoUrl: getMomentFallbackIllustration(2),
      aspect: "portrait"
    },
    {
      id: 3,
      numberStr: "03",
      title: "Simply You",
      caption: "03 — Simply You",
      quote: "May your life be filled with love, success and all the beautiful things you deserve. ♡",
      pdfPage: 3,
      tag: "Warm Ambient Glow",
      sceneDescription: "Leaning gently on her hand with golden bokeh lamps and warm candlelight.",
      accentColor: "#9E5868",
      photoUrl: getMomentFallbackIllustration(3),
      aspect: "portrait"
    },
    {
      id: 4,
      numberStr: "04",
      title: "One To Remember",
      caption: "04 — One To Remember",
      quote: "Keep being the sweet, kind and amazing girl you are. The world is lucky to have you! ♡",
      pdfPage: 6,
      tag: "Balloons & Blue Sky",
      sceneDescription: "Holding vibrant pastel balloons outdoors under open skies with blooming flowers.",
      accentColor: "#7B6194",
      photoUrl: getMomentFallbackIllustration(4),
      aspect: "portrait"
    },
    {
      id: 5,
      numberStr: "05",
      title: "A Beautiful Memory",
      caption: "05 — A Beautiful Memory",
      quote: "May your days be as bright as your smile and your heart as big as your dreams. ♡",
      pdfPage: 7,
      tag: "Wrapped In Love",
      sceneDescription: "Dressed in rich royal burgundy holding a pink ribbon-wrapped birthday gift box.",
      accentColor: "#701A28",
      photoUrl: getMomentFallbackIllustration(5),
      aspect: "portrait"
    },
    {
      id: 6,
      numberStr: "06",
      title: "Your Happy Side",
      caption: "06 — Your Happy Side",
      quote: "Keep chasing your dreams, keep growing, keep being you. You're doing great! ♡",
      pdfPage: 8,
      tag: "Cake Cutting Joy",
      sceneDescription: "Cutting the chocolate birthday cake surrounded by fairy lights and celebration cheers.",
      accentColor: "#613D46",
      photoUrl: getMomentFallbackIllustration(6),
      aspect: "portrait"
    },
    {
      id: 7,
      numberStr: "07",
      title: "Another Little Moment",
      caption: "07 — Another Little Moment",
      quote: "May your life be as colorful and beautiful as the flowers around you. ♡",
      pdfPage: 9,
      tag: "Floral Blooms",
      sceneDescription: "Surrounded by blooming pink garden flowers holding her berry birthday treat.",
      accentColor: "#D9777F",
      photoUrl: getMomentFallbackIllustration(7),
      aspect: "portrait"
    },
    {
      id: 8,
      numberStr: "08",
      title: "Always Special",
      caption: "08 — Always Special",
      quote: "Shine brighter, dream bigger, be happier. You deserve it all. ♡",
      pdfPage: 11,
      tag: "Midnight Radiance",
      sceneDescription: "In elegant black embroidery lit by twinkling starlight fairy lights and candle glow.",
      accentColor: "#33222B",
      photoUrl: getMomentFallbackIllustration(8),
      aspect: "portrait"
    },
    {
      id: 9,
      numberStr: "09",
      title: "A Moment Worth Keeping",
      caption: "09 — A Moment Worth Keeping",
      quote: "You make life brighter, smarter, softer and so special. Never forget how loved you are! ♡",
      pdfPage: 13,
      tag: "Soft & Sweet",
      sceneDescription: "Resting comfortably on the vintage blush armchair beside pastel balloons.",
      accentColor: "#B57B89",
      photoUrl: getMomentFallbackIllustration(9),
      aspect: "portrait"
    },
    {
      id: 10,
      numberStr: "10",
      title: "Forever A Memory",
      caption: "10 — Forever A Memory",
      quote: "May you always be surrounded by love, success and endless opportunities. So proud of you! ♡",
      pdfPage: 14,
      tag: "Celebration Milestone",
      sceneDescription: "Standing with the grand celebratory floral bouquet and birthday cake.",
      accentColor: "#52131D",
      photoUrl: getMomentFallbackIllustration(10),
      aspect: "portrait"
    }
  ],

  // -----------------------------------------------------------------------
  // 4. MEMORY SCRAPBOOK (Requirement #11)
  // -----------------------------------------------------------------------
  scrapbook: [
    {
      id: "sb-1",
      momentId: 1,
      title: "First Cake Wish",
      note: "Closing your eyes and making a silent wish right before blowing out the candles. Never lose that spark!",
      tapeColor: "#F4DCD6",
      rotation: -2,
      sticker: "🌸"
    },
    {
      id: "sb-2",
      momentId: 2,
      title: "Garden Sunshine",
      note: "The mathal hat adventure! You bring laughter and sunshine wherever you walk.",
      tapeColor: "#EAE0D5",
      rotation: 3,
      sticker: "✨"
    },
    {
      id: "sb-3",
      momentId: 4,
      title: "Balloon Dreams",
      note: "Holding balloons high up towards the summer sky. Keep dreaming big, little one.",
      tapeColor: "#F3D7D7",
      rotation: -3,
      sticker: "🎈"
    },
    {
      id: "sb-4",
      momentId: 5,
      title: "Birthday Surprises",
      note: "That excited look when unwrapping birthday gifts! Your joy is truly contagious.",
      tapeColor: "#E7C5C8",
      rotation: 2,
      sticker: "🎁"
    },
    {
      id: "sb-5",
      momentId: 7,
      title: "Among The Flowers",
      note: "As colorful and radiant as the flowers around you. Blooming gracefully every single year.",
      tapeColor: "#E2D4C9",
      rotation: -1.5,
      sticker: "🌷"
    },
    {
      id: "sb-6",
      momentId: 8,
      title: "Fairy Lights & Twinkles",
      note: "Glow in the dark. Your warmth and kindness shine even in the quietest hours.",
      tapeColor: "#D8BFD8",
      rotation: 2.5,
      sticker: "⭐"
    }
  ],

  // -----------------------------------------------------------------------
  // 5. SURPRISE GIFT SECTION (Requirement #12)
  // -----------------------------------------------------------------------
  surpriseSection: {
    title: "I Have One More Surprise For You 🎁",
    subtitle: "A little token packed with all my best wishes and blessings.",
    buttonText: "Open the Gift ✨",
    openedButtonText: "Gift Opened with Love ❤️",
    hiddenMessage: "Whatever life brings, I hope you always remember how loved and special you are. ❤️",
    subNote: "May every path you take be filled with kindness, success, and genuine smiles."
  },

  // -----------------------------------------------------------------------
  // 6. FINAL CINEMATIC SECTION (Requirement #17 & #18)
  // -----------------------------------------------------------------------
  finalSection: {
    heroTitle: "Happy Birthday, NOUSHIN JAHAN EMMI ❤️",
    blessing: "May you always smile the way you do today.",
    loveNote: "With lots of love ❤️",
    footerCredit: "Made especially for you."
  },

  // -----------------------------------------------------------------------
  // 7. BACKGROUND BIRTHDAY MUSIC (Requirement #13 & #14)
  // -----------------------------------------------------------------------
  musicConfig: {
    title: "Pori Aay — Birthday Melody for Emmi",
    artist: "Acoustic Sister Lullaby",
    description: "A gentle, melodic Bengali song dedicated to dreaming, peace, and sweet birthday wishes.",
    defaultSrc: "/audio/birthday-song.mp3"
  }
};
