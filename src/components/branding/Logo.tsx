"use client";

import { useTheme } from "@/context/ThemeContext";
import LogoSvg from './Logo.svg';
import LogoBlackSvg from './Logo-black.svg';

interface LogoProps {
  onClick?: (e: React.MouseEvent) => void;
}

export default function Logo({ onClick }: LogoProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return isLight 
    ? <LogoBlackSvg aria-label="Logo" onClick={onClick} className="cursor-pointer" />
    : <LogoSvg aria-label="Logo" onClick={onClick} className="cursor-pointer" />;
}
