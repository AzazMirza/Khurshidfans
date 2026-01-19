// app/theme/page.tsx
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemePage() {
  return (
    <div className="container py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Theme Customization</CardTitle>
          <p className="text-muted-foreground">
            Customize your dashboard theme. Changes are saved automatically.
          </p>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>
    </div>
  );
}