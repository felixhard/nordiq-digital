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
    const { theme } = useTheme();
    
    // Default background color based on theme
    const defaultBgColor = theme === "light" 
        ? "bg-white" 
        : "bg-bg-gradient";
    
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
                theme === "light" ? "shadow-light-card" : "",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
