import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";

type CardProps = {
    width?: string;
    cursor?: string;
    bgColor?: string;
    padding?: string;
    children: React.ReactNode;
    border?: string;
    borderColor?: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Card({
    width = "w-full",
    cursor = "default",
    bgColor,
    padding = "p-4",
    children,
    onClick,
    border = "border-x border-t",
    borderColor = "border-border",
    className,
}: CardProps) {
    // Try to use the useTheme hook, but fall back to detecting the theme from the document body
    let themeValue = "light";
    
    try {
        // Try to use the context first
        const { theme } = useTheme();
        themeValue = theme;
    } catch (e) {
        // If useTheme fails, detect theme from body classes
        if (typeof document !== 'undefined') {
            themeValue = document.body.classList.contains('agency') || document.body.classList.contains('dark') 
                ? 'dark' 
                : 'light';
        }
    }
    
    // Default background color based on theme - use bg-background instead of hard-coded colors
    const defaultBgColor = "bg-background";
    
    return (
        <div
            className={clsx(
                "relative gap-4 rounded-2xl backdrop-blur-md",
                cursor,
                borderColor,
                border,
                width,
                bgColor || defaultBgColor,
                padding,
                themeValue === "light" ? "shadow-light-card" : "",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
