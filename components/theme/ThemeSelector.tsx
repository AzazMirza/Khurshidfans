// components/theme/ThemeSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemePreview } from "./ThemesPreview";
import {
  ThemeColors,
  THEME_PRESETS,
  applyTheme,
  saveThemeToStorage,
  loadThemeFromStorage,
} from "@/lib/theme";

export function ThemeSelector() {
  const [colors, setColors] = useState<ThemeColors>(loadThemeFromStorage());
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Apply theme on mount & when colors change
  useEffect(() => {
    applyTheme(colors);
    saveThemeToStorage(colors);
  }, [colors]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null); // Custom theme
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setColors(preset.colors);
    setActivePreset(preset.id);
    
  };

  const resetToDefault = () => {
    setColors(THEME_PRESETS[0].colors);
    setActivePreset(THEME_PRESETS[0].id);
  };

  const colorFields: Array<{ key: keyof ThemeColors; label: string }> = [
    { key: "pr", label: "Primary" },
    { key: "se", label: "Secondary" },
    { key: "tx", label: "Text" },
    { key: "bg", label: "Background" },
  ];

  // function submitCustomTheme (colors: ThemeColors) {

  //   const col = (...keys: (keyof ThemeColors)[]) => keys.map((key) => colors[key]);

  //   const theme = fetch (`/api/theme`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ col }) // col
  //   })

  //   console.log(theme);

  //   // applyTheme(colors);
  //   // saveThemeToStorage(colors);
  //   // setActivePreset(null);
  // };

  const submitCustomTheme = async () => {
  try {
    // ✅ Only send plain data from state
    const payload = {
      pr: colors.pr,
      se: colors.se,
      tx: colors.tx,
      bg: colors.bg,
    };

    console.log("📤 Submitting theme:", payload); // ✅ Safe

    const response = await fetch(`/api/theme`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    console.log("✅ Saved:", result);
    // ... success handling
  } catch (err) {
    console.error("❌ Error:", err instanceof Error ? err.message : err);
  }
};

  return (
    <div className="space-y-8">
      {/* Theme Preview */}
      <ThemePreview colors={colors} />

      {/* Custom Color Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorFields.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`color-${key}`}>{label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={`color-${key}`}
                    type="color"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-10 w-16 p-1"
                  />
                  <Input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="font-mono flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between gap-2">
            <span className=" flex gap-2" >
            <Button
              variant={activePreset ? "outline" : "default"}
              size="sm"
              onClick={submitCustomTheme}
            >
              Submit
            </Button>
            {activePreset && (
              <Badge variant="secondary">Active: {THEME_PRESETS.find(p => p.id === activePreset)?.name}</Badge>
            )}

            </span>
            <Button
              variant={activePreset ? "outline" : "default"}
              size="sm"
              onClick={resetToDefault}
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                  activePreset === preset.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary"
                }`}
                style={{ backgroundColor: preset.colors.bg }}
              >
                <div className="font-medium text-sm truncate mb-1" style={{ color: preset.colors.tx }}>
                  {preset.name}
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: preset.colors.pr }}
                  />
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: preset.colors.se }}
                  />
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: preset.colors.tx }}
                  />
                </div>
                {preset.isPastel && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      Pastel
                    </Badge>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}