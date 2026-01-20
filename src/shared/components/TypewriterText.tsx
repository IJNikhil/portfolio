import { useState, useEffect } from "react";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    cursor?: boolean;
}

export const TypewriterText = ({ text, speed = 30, delay = 0, className, cursor = false }: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (!text) {
            setDisplayedText("");
            return;
        }

        let index = 0;
        setDisplayedText("");

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(() => text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, started]);

    return (
        <span className={className}>
            {displayedText}
            {cursor && <span className="animate-pulse">_</span>}
        </span>
    );
};
