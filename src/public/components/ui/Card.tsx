import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "glass" | "solid";
    hoverEffect?: boolean;
}

export default function Card({
    className,
    variant = "solid",
    hoverEffect = false,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={clsx(
                "rounded-2xl border transition-all duration-300",
                variant === "glass"
                    ? "glass-panel"
                    : "bg-surface border-border shadow-soft",
                hoverEffect && "hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
