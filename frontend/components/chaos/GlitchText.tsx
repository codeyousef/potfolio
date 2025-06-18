'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface GlitchTextProps {
  text: string;
  className?: string;
  splitOnScroll?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlitchText({ 
  text, 
  className = '', 
  splitOnScroll = false,
  intensity = 'medium' 
}: GlitchTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [chars, setChars] = useState<string[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setChars(text.split(''));
  }, [text]);

  useEffect(() => {
    if (!splitOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll('.char');
        chars.forEach((char, index) => {
          const offsetY = progress * 100 * Math.sin(index * 0.5);
          const offsetX = progress * 50 * Math.cos(index * 0.5);
          const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
          
          gsap.to(char, {
            y: offsetY,
            x: offsetX,
            rotation: rotation,
            opacity: 1 - progress * 0.5,
            duration: 0.3
          });
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [splitOnScroll]);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 1000);

    return () => clearInterval(glitchInterval);
  }, []);

  const getGlitchClass = () => {
    if (!isGlitching) return '';
    
    switch (intensity) {
      case 'low': return 'glitch-low';
      case 'high': return 'glitch-high';
      default: return 'glitch';
    }
  };

  if (splitOnScroll) {
    return (
      <span 
        ref={textRef} 
        className={`split-text ${className} ${getGlitchClass()}`}
        data-text={text}
      >
        {chars.map((char, index) => (
          <span 
            key={index} 
            className="char inline-block"
            style={{ '--char-index': index } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span 
      ref={textRef} 
      className={`${className} ${getGlitchClass()}`}
      data-text={text}
    >
      {text}
    </span>
  );
}