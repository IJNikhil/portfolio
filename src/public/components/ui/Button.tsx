import { memo } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = memo(({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-glow border-transparent",
        secondary: "bg-white text-text-main border border-border hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        outline: "bg-transparent border border-border text-text-main hover:border-primary hover:text-primary",
        ghost: "bg-transparent text-text-muted hover:bg-black/5 hover:text-text-main border-transparent",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-8 text-base",
    };

    return (
        <button
            className={clsx(
                "relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
