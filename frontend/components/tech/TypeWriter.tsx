'use client';

import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypeWriter({ text, speed = 100, onComplete }: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">_</span>}
    </span>
  );
}