"use client";

import { useTheme } from "@/context/ThemeContext";
import { Iconify } from "./ui/Iconify";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <div className="ml-2 mr-4 md:ml-2 md:mr-4 flex items-center justify-center w-full md:w-auto">
      <button 
        onClick={toggleTheme}
        className="relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none"
        style={{ backgroundColor: isLight ? '#d1d5db' : '#404BE3' }}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      >
        {/* White circle/thumb with absolute positioning */}
        <div 
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ 
            transform: isLight ? 'translateX(0)' : 'translateX(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLight ? (
            <Iconify 
              icon="ph:sun-bold" 
              style={{ fontSize: '13px', color: 'black' }} 
            />
          ) : (
            <Iconify 
              icon="ph:moon-bold" 
              style={{ fontSize: '13px', color: 'black' }} 
            />
          )}
        </div>
      </button>
    </div>
  );
} 