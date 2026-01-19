// components/theme/ThemePreview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeColors } from "@/lib/theme";

interface ThemePreviewProps {
  colors: ThemeColors;
}

export function ThemePreview({ colors }: ThemePreviewProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.se,
      }}
    >
      <CardHeader
        className="pb-3"
        style={{ backgroundColor: colors.pr, color: getContrastColor(colors.pr) }}
      >
        <CardTitle>Theme Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2" style={{ color: colors.tx }}>
            Sample UI Elements
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              style={{
                backgroundColor: colors.pr,
                color: getContrastColor(colors.pr),
              }}
            >
              Primary
            </Badge>
            <Badge
              variant="secondary"
              style={{
                backgroundColor: colors.se,
                color: getContrastColor(colors.se),
              }}
            >
              Secondary
            </Badge>
            <Badge
              variant="outline"
              style={{
                borderColor: colors.tx,
                color: colors.tx,
              }}
            >
              Accent
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            style={{
              backgroundColor: colors.pr,
              color: getContrastColor(colors.pr),
            }}
          >
            Primary
          </Button>
          <Button
            size="sm"
            variant="outline"
            style={{
              borderColor: colors.tx,
              color: colors.tx,
            }}
          >
            Accent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper (same logic as lib/theme.ts)
const getContrastColor = (hex?: string): string => {
  if (!hex) return "#ffffff";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff";
};
