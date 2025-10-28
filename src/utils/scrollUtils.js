// src/utils/scrollUtils.js

export const smoothScrollTo = (targetPosition, duration = 1000) => {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = (t) => t * t * (3 - 2 * t); // Smooth ease-in-out
    window.scrollTo(0, startPosition + distance * ease(progress));

    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};

export const scrollToSection = (id, offset = 60, duration = 1000) => {
  try {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Section with ID "${id}" not found`);
      return;
    }

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(elementPosition - offset, duration);
  } catch (error) {
    console.error(`Error scrolling to section "${id}":`, error);
  }
};
