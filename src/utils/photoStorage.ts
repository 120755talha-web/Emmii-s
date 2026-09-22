/**
 * Photo Storage & Local Persistence Utility
 * Manages photo URLs, custom uploaded photos in IndexedDB, and graceful fallbacks.
 */

const DB_NAME = 'emmi_birthday_db';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

export async function savePhoto(key: string, dataUrl: string): Promise<void> {
  // 1. Save to local IndexedDB
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, key);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB, fallback to localStorage', err);
  }

  // 2. Backup to localStorage
  try {
    localStorage.setItem(`emmi_photo_${key}`, dataUrl);
  } catch {
    // ignore quota limits if data URL is large
  }

  // 3. Save permanently to backend Server so anyone visiting live URL sees it
  try {
    fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, dataUrl }),
    }).catch((e) => console.warn('Server photo sync deferred', e));
  } catch {
    // ignore
  }

  // 4. Dispatch event to notify components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('emmi-photos-updated', { detail: { key, dataUrl } }));
  }
}

export async function saveMultiplePhotos(photosMap: Record<string, string>): Promise<void> {
  // 1. Save to IndexedDB
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const [k, v] of Object.entries(photosMap)) {
      store.put(v, k);
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB batch error', err);
  }

  // 2. Backup to localStorage
  for (const [k, v] of Object.entries(photosMap)) {
    try {
      localStorage.setItem(`emmi_photo_${k}`, v);
    } catch {
      // ignore quota
    }
  }

  // 3. Save permanently to backend Server
  try {
    await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: photosMap }),
    });
  } catch (err) {
    console.warn('Server batch save warning', err);
  }

  // 4. Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('emmi-photos-updated', { detail: { photosMap } }));
  }
}

export async function getPhoto(key: string): Promise<string | null> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    const idbResult = await new Promise<string | null>((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    if (idbResult) return idbResult;
  } catch {
    // ignore
  }

  try {
    return localStorage.getItem(`emmi_photo_${key}`);
  } catch {
    return null;
  }
}

export async function getAllCustomPhotos(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  // 1. Load from IndexedDB
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const cursorReq = store.openCursor();
    await new Promise<void>((resolve) => {
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          result[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve();
        }
      };
      cursorReq.onerror = () => resolve();
    });
  } catch {
    // fallback check localStorage
    for (let i = 1; i <= 10; i++) {
      const val = localStorage.getItem(`emmi_photo_moment_${i}`);
      if (val) result[`moment_${i}`] = val;
    }
    const hero = localStorage.getItem('emmi_photo_hero');
    if (hero) result['hero'] = hero;
  }

  // 2. Fetch from persistent Server storage
  let serverPhotos: Record<string, string> = {};
  try {
    const res = await fetch('/api/photos');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.photos) {
        serverPhotos = data.photos;
      }
    }
  } catch {
    // offline or static mode
  }

  // 3. Merge: server photos have authority for live multi-user/multi-device,
  // while any unsynced local photos are preserved and pushed to server
  const merged: Record<string, string> = { ...result, ...serverPhotos };

  // 4. If client has local photos that are missing on the server, auto-sync them to server!
  const unsyncedKeys = Object.keys(result).filter((k) => !serverPhotos[k]);
  if (unsyncedKeys.length > 0) {
    const toSync: Record<string, string> = {};
    unsyncedKeys.forEach((k) => {
      toSync[k] = result[k];
    });
    fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: toSync }),
    }).catch(() => {});
  }

  // 5. Cache any server photos into local IndexedDB for instant offline loading
  if (Object.keys(serverPhotos).length > 0) {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const [k, v] of Object.entries(serverPhotos)) {
        store.put(v, k);
      }
    } catch {
      // ignore
    }
  }

  return merged;
}

export async function clearAllCustomPhotos(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`emmi_photo_moment_${i}`);
    }
    localStorage.removeItem('emmi_photo_hero');
  } catch (err) {
    console.error('Failed to clear local photos', err);
  }

  try {
    await fetch('/api/reset-photos', { method: 'POST' });
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('emmi-photos-updated', { detail: { cleared: true } }));
  }
}

/**
 * Generates an authentic SVG portrait illustration corresponding to each of Emmi's 10 moments
 * from the PDF. Used when a raw photo file is pending or loading.
 */
export function getMomentFallbackIllustration(momentId: number): string {
  // Return an artistic SVG representing each authentic scene from the PDF
  const scenes: Record<number, { bg: string; title: string; subtitle: string; icon: string; dress: string; props: string }> = {
    1: {
      bg: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 50%, #F472B6 100%)",
      title: "Moment 01 — Birthday Wishes",
      subtitle: "Pink floral cake with glowing candles & balloons",
      icon: "🎂",
      dress: "Sage floral kurti & vibrant fuchsia dupatta",
      props: "Purple hair flower & candle glow"
    },
    2: {
      bg: "linear-gradient(135deg, #FEF3C7 0%, #D1FAE5 50%, #6EE7B7 100%)",
      title: "Moment 02 — Sunshine & Smiles",
      subtitle: "Garden greenery & traditional woven straw hat",
      icon: "👒",
      dress: "Floral dress & fuchsia scarf",
      props: "Mathal hat with sunny morning glow"
    },
    3: {
      bg: "linear-gradient(135deg, #FEF3C7 0%, #FED7AA 50%, #F59E0B 100%)",
      title: "Moment 03 — Ambient Candlelight",
      subtitle: "Leaning gently beside the glowing birthday cake",
      icon: "🕯️",
      dress: "Blush pink floral dress",
      props: "Warm golden bokeh lights"
    },
    4: {
      bg: "linear-gradient(135deg, #E0E7FF 0%, #DDD6FE 50%, #C084FC 100%)",
      title: "Moment 04 — Balloon Dreams",
      subtitle: "Pastel balloon cluster outdoors under blue skies",
      icon: "🎈",
      dress: "Pastel flower print dress",
      props: "Purple hair blossom & bright joy"
    },
    5: {
      bg: "linear-gradient(135deg, #FFE4E6 0%, #FDA4AF 50%, #BE123C 100%)",
      title: "Moment 05 — Birthday Gift Surprise",
      subtitle: "Holding a wrapped pink birthday present",
      icon: "🎁",
      dress: "Rich royal burgundy embroidered kurti",
      props: "Satin ribbon gift box"
    },
    6: {
      bg: "linear-gradient(135deg, #4B1A24 0%, #701A28 50%, #991B1B 100%)",
      title: "Moment 06 — Cutting the Cake",
      subtitle: "Chocolate birthday cake with celebratory sparklers",
      icon: "🍰",
      dress: "Cream kurti with magenta dupatta",
      props: "Fairy lights & black balloons"
    },
    7: {
      bg: "linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 50%, #EC4899 100%)",
      title: "Moment 07 — Floral Garden",
      subtitle: "Holding berry cake in lush blooming bougainvillea",
      icon: "🌺",
      dress: "Pink floral print & hair flower",
      props: "Vibrant garden flower blossoms"
    },
    8: {
      bg: "linear-gradient(135deg, #18181B 0%, #27272A 50%, #3F3F46 100%)",
      title: "Moment 08 — Starlight Radiance",
      subtitle: "Elegant black embroidery with twinkling fairy lights",
      icon: "✨",
      dress: "Royal black embroidered evening wear",
      props: "Warm lit candles & golden fairy lights"
    },
    9: {
      bg: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FDA4AF 100%)",
      title: "Moment 09 — Sweet & Serene",
      subtitle: "Resting gently on the vintage blush armchair",
      icon: "🛋️",
      dress: "Cream & magenta celebration wear",
      props: "Soft pastel party balloons"
    },
    10: {
      bg: "linear-gradient(135deg, #271E24 0%, #4C1D2F 50%, #831843 100%)",
      title: "Moment 10 — Milestone Celebration",
      subtitle: "Standing with the grand bouquet and celebration cake",
      icon: "💐",
      dress: "Elegant black dress with golden work",
      props: "Lush rose bouquet & birthday cake"
    }
  };

  const scene = scenes[momentId] || scenes[1];
  const isDark = momentId === 6 || momentId === 8 || momentId === 10;
  const textColor = isDark ? "#FFFFFF" : "#4A1D24";
  const subColor = isDark ? "#FCE7F3" : "#7A4B54";

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
      <defs>
        ${scene.bg.startsWith('linear-gradient') ? `
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${isDark ? '#2D141A' : '#FCE7F3'}"/>
          <stop offset="50%" stop-color="${isDark ? '#4A1D24' : '#F8D7DA'}"/>
          <stop offset="100%" stop-color="${isDark ? '#701A28' : '#D9777F'}"/>
        </linearGradient>
        ` : `
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCE7F3"/>
          <stop offset="100%" stop-color="#D9777F"/>
        </linearGradient>
        `}
        <radialGradient id="glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#FFF" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.15"/>
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#bg)"/>
      <rect width="800" height="1000" fill="url(#glow)"/>
      <rect x="30" y="30" width="740" height="940" rx="16" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(112,26,40,0.15)'}" stroke-width="2" stroke-dasharray="6,6"/>
      
      <!-- Frame ornament -->
      <circle cx="400" cy="380" r="160" fill="${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)'}" stroke="${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(226,149,149,0.5)'}" stroke-width="3"/>
      
      <!-- Scene Icon -->
      <text x="400" y="420" font-size="110" text-anchor="middle" dominant-baseline="middle">${scene.icon}</text>
      
      <!-- Number badge -->
      <rect x="340" y="160" width="120" height="42" rx="21" fill="${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)'}"/>
      <text x="400" y="188" font-family="'Playfair Display', serif" font-weight="bold" font-size="20" fill="${textColor}" text-anchor="middle">MOMENT ${momentId < 10 ? '0' + momentId : momentId}</text>

      <!-- Headings -->
      <text x="400" y="600" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="${textColor}" text-anchor="middle">${scene.title}</text>
      <text x="400" y="645" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" fill="${subColor}" text-anchor="middle">${scene.subtitle}</text>
      
      <!-- Details Card -->
      <rect x="120" y="700" width="560" height="160" rx="14" fill="${isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.75)'}" stroke="${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(217,119,127,0.3)'}" stroke-width="1.5"/>
      <text x="400" y="745" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="${textColor}" text-anchor="middle">🌸 Outfit: ${scene.dress}</text>
      <text x="400" y="785" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="${subColor}" text-anchor="middle">✨ Scene: ${scene.props}</text>
      <text x="400" y="825" font-family="'Alex Brush', cursive" font-size="24" fill="${isDark ? '#FBCFE8' : '#701A28'}" text-anchor="middle">Original Photo from Emmi's Birthday Album</text>
    </svg>
  `)}`;
}
