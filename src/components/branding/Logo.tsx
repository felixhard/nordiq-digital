import LogoSvg from './Logo.svg';

interface LogoProps {
  onClick?: (e: React.MouseEvent) => void;
}

export default function Logo({ onClick }: LogoProps) {
  return <LogoSvg aria-label="Logo" onClick={onClick} className="cursor-pointer" />;
}
