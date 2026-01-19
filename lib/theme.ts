// lib/theme.ts
export interface ThemeColors {
  
  pr: string;
  se: string;
  tx: string;
  bg: string;
}

export type ThemePreset = {
  name: string;
  id: string;
  colors: ThemeColors;
  isPastel?: boolean; 
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Airion Mint",
    id: "airion-mint",
    isPastel: true,
    colors: {
      pr: "#A8E6CF",
      se: "#D4F1F9",
      tx: "#FFD3B6",
      bg: "#FFF8F0",
      
    },
  },
  {
    name: "Airion Lavender",
    id: "airion-lavender",
    isPastel: true,
    colors: {
      pr: "#D4C1EC",
      se: "#F6E5FF",
      tx: "#FFD1DC",
      bg: "#FFF5F7",
      
    },
  },
  // 🌈 Classic
  {
    name: "Slate",
    id: "slate",
    colors: {
      pr: "#3b82f6",
      se: "#64748b",
      tx: "#f59e0b",
      bg: "#f8fafc",
      

    },
  },
  {
    name: "Emerald",
    id: "emerald",
    colors: {
      pr: "#10b981",
      se: "#059669",
      tx: "#d97706",
      bg: "#f0fdf4",
      

    },
  },
  {
    name: "Rose",
    id: "rose",
    colors: {
      pr: "#f43f5e",
      se: "#be123c",
      tx: "#eab308",
      bg: "#fef2f2",
      

    },
  },
  // 🌓 Dark Mode
  {
    name: "Midnight",
    id: "midnight",
    colors: {
      pr: "#818cf8",
      se: "#a5b4fc",
      tx: "#ffffff",
      bg: "#0f172a",
      

    },
  },
];

export const DEFAULT_THEME: ThemeColors = THEME_PRESETS[0].colors;

export const applyTheme = (colors: ThemeColors) => {
  document.documentElement.style.setProperty("--pr", colors.pr);
  document.documentElement.style.setProperty("--pr-foreground", getContrastColor(colors.pr));
  document.documentElement.style.setProperty("--se", colors.se);
  document.documentElement.style.setProperty("--se-foreground", getContrastColor(colors.se));
  document.documentElement.style.setProperty("--tx", colors.tx);
  document.documentElement.style.setProperty("--tx-foreground", getContrastColor(colors.tx));
  document.documentElement.style.setProperty("--bg", colors.bg);
  document.documentElement.style.setProperty("--foreground", getContrastColor(colors.bg));
};

// Simple contrast helper (black/white based on luminance)
const getContrastColor = (hex: string): string => {
  if (!hex) return "#ffffff";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export const loadThemeFromStorage = (): ThemeColors => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const saved = localStorage.getItem("theme");
  return saved ? JSON.parse(saved) : DEFAULT_THEME;
};

export const saveThemeToStorage = (colors: ThemeColors) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", JSON.stringify(colors));
  }
};