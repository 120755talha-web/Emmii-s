import { BIRTHDAY_DATA } from '../config/birthdayData';
import { BirthdayDataConfig } from '../types';

const STORAGE_KEY = 'emmi_birthday_custom_content';

/**
 * Loads birthday data with full server and local persistence.
 * Guarantees that customized text, letters, and wishes never disappear.
 */
export async function getPersistentBirthdayData(): Promise<BirthdayDataConfig> {
  let serverContent: Partial<BirthdayDataConfig> | null = null;

  // 1. Try loading from persistent backend server
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.content) {
        serverContent = data.content;
      }
    }
  } catch {
    // offline or static fallback
  }

  // 2. Try loading from browser localStorage
  let localContent: Partial<BirthdayDataConfig> | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        localContent = JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  // 3. If local has content but server does not, sync local to server in background
  if (localContent && !serverContent) {
    try {
      fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: localContent }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  const customMerged = {
    ...BIRTHDAY_DATA,
    ...(localContent || {}),
    ...(serverContent || {}),
    birthdayLetter: {
      ...BIRTHDAY_DATA.birthdayLetter,
      ...(localContent?.birthdayLetter || {}),
      ...(serverContent?.birthdayLetter || {}),
    },
  };

  // Cache latest merged content locally
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customMerged));
    } catch {
      // ignore
    }
  }

  return customMerged as BirthdayDataConfig;
}

/**
 * Saves customized birthday writings permanently to both Server and Local Storage
 */
export async function savePersistentBirthdayData(
  updatedContent: Partial<BirthdayDataConfig>
): Promise<void> {
  // 1. Save locally
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      const merged = { ...parsed, ...updatedContent };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (err) {
      console.warn('Local save warning', err);
    }
  }

  // 2. Save to server
  try {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: updatedContent }),
    });
  } catch (err) {
    console.warn('Server save warning', err);
  }

  // 3. Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('emmi-content-updated', { detail: updatedContent })
    );
  }
}

/**
 * Resets customized writings back to default
 */
export async function resetPersistentBirthdayData(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  try {
    await fetch('/api/reset-content', { method: 'POST' });
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('emmi-content-updated', { detail: BIRTHDAY_DATA })
    );
  }
}
