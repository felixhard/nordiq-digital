"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Only run after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    // If no saved theme, check for system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    } else {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme class to body
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove("light", "agency", "dark", "deep-sea", "forest");
    
    // Add the current theme class
    if (theme === "dark") {
      body.classList.add("agency"); // Use agency class for dark theme
    } else {
      body.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Prevent rendering children until after hydration to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 