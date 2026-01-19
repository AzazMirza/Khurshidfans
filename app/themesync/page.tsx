// app/components/ThemeSync.tsx
'use client';

import { useEffect } from 'react';
import { DEFAULT_THEME, ThemeColors } from '@/lib/theme';

interface ThemeSyncProps {
  // If you fetched a server theme, pass it as fallback
  serverTheme?: ThemeColors;
}

export default function ThemeSync({ serverTheme }: ThemeSyncProps) {
  useEffect(() => {
    // 1. Read from localStorage (client-only)
    const stored = localStorage.getItem('theme');
    let theme: ThemeColors;

    try {
      theme = stored ? JSON.parse(stored) : serverTheme || DEFAULT_THEME;
    } catch {
      theme = serverTheme || DEFAULT_THEME;
    }

    // 2. Apply theme as CSS variables (best practice)
    const root = document.documentElement;
    root.style.setProperty('--nav-color', theme.pr);
    root.style.setProperty('--gold-btn-color', theme.se);
    root.style.setProperty('--gold-btn-hover', theme.tx);
    root.style.setProperty('--text-color', theme.tx);
    root.style.setProperty('--bg-color', theme.bg);

    // 3. (Optional) Listen for changes in other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          root.style.setProperty('--nav-color', updated.pr);
          root.style.setProperty('--gold-btn-color', updated.se);
          root.style.setProperty('--gold-btn-hover', updated.tx);
          root.style.setProperty('--text-color', updated.tx);
          root.style.setProperty('--bg-color', updated.bg);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [serverTheme]);

  return null;
}