import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Wait until after client-side hydration to show UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Add a small delay for animation
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark");
      setIsAnimating(false);
    }, 150);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="theme-toggle group relative overflow-hidden"
      disabled={isAnimating}
    >
      <div className="relative h-4 w-4">
        <Sun 
          className={`theme-toggle-icon absolute inset-0 transition-all duration-300 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon 
          className={`theme-toggle-icon absolute inset-0 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}