import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Container from "./ui/Container";
import Navigation from "./Navigation";
import fallbackAvatar from "../assets/hero-avatar.png";

function TextContent({ firstName, lastName, intro }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = `Hi, I'm ${firstName} ${lastName}|${intro}`;
  const nameLength = `Hi, I'm ${firstName} ${lastName}`.length;

  useEffect(() => {
    let index = 0;
    let rafId;

    const isVowel = (char) => /[aeiouAEIOU]/.test(char);
    const typeText = () => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
        const isIntroPhase = index > nameLength;
        const delay = isVowel(fullText[index - 1] || "") ? (isIntroPhase ? 60 : 80) : (isIntroPhase ? 80 : 120);
        rafId = setTimeout(() => requestAnimationFrame(typeText), delay);
      } else {
        setShowCursor(false);
        clearTimeout(rafId);
      }
    };

    rafId = requestAnimationFrame(typeText);
    return () => clearTimeout(rafId);
  }, [fullText, nameLength]);

  useEffect(() => {
    if (displayedText.length >= fullText.length) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [displayedText, fullText]);

  const nameText = displayedText.split("|")[0] || "";
  const introText = displayedText.split("|")[1] || "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col justify-center text-center sm:text-left sm:pr-4 md:pr-6"
      aria-live="polite"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 font-serif">
        {nameText.length < nameLength ? nameText : `Hi, I'm `}
        {nameText.length >= nameLength && (
          <span className="text-accent">{`${firstName} ${lastName}`}</span>
        )}
        <AnimatePresence>
          {displayedText.length < fullText.length && (
            <motion.span
              key="cursor"
              initial={{ opacity: 0 }}
              animate={{ opacity: showCursor ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-1 h-6 sm:h-7 md:h-8 lg:h-10 bg-accent align-middle ml-1"
            />
          )}
        </AnimatePresence>
      </h1>
      {nameText.length >= nameLength && (
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 max-w-full sm:max-w-md md:max-w-lg mx-auto sm:mx-0">
          {introText}
          {introText.length < intro.length && (
            <motion.span
              key="cursor-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: showCursor ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-1 h-3 sm:h-4 md:h-5 bg-accent align-middle ml-1"
            />
          )}
        </p>
      )}
    </motion.div>
  );
}

function ImageContent({ avatar, firstName, lastName }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="flex-1 flex justify-center sm:justify-end"
    >
      <img
        src={avatar || fallbackAvatar}
        alt={`Portrait of ${firstName} ${lastName}`}
        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl border-4 border-accent/50 transition-transform duration-300"
        onError={(e) => (e.target.src = fallbackAvatar)}
      />
    </motion.div>
  );
}

export default function HeroSection({ data }) {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-bg to-gray-900 min-h-screen flex items-center relative">
      <Navigation />
<Container className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
  <Suspense fallback={<div className="flex-1" />}>
    <TextContent
      firstName={data.firstName}
      lastName={data.lastName}
      intro={data.intro}
    />
  </Suspense>

  <Suspense
    fallback={
      <div className="flex-1 flex justify-center sm:justify-end">
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-card to-gray-800 animate-pulse" />
      </div>
    }
  >
    <ImageContent
      avatar={data.avatar}
      firstName={data.firstName}
      lastName={data.lastName}
    />
  </Suspense>
</Container>

    </section>
  );
}