'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Reality {
  id: string;
  probability: number;
  background: string;
  title: string;
  description: string;
}

interface RealityLayerProps {
  reality: Reality;
  index: number;
  isActive: boolean;
}

export default function RealityLayer({ reality, index, isActive }: RealityLayerProps) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentGlitchText, setCurrentGlitchText] = useState(0);

  // Create glitch variations based on title
  const glitchTexts = [
    reality.title,
    reality.title.split('').reverse().join(''),
    reality.title.replace(/[aeiou]/gi, '*'),
    reality.title.toUpperCase(),
    '█'.repeat(reality.title.length),
    reality.title.split(' ').reverse().join(' ')
  ];

  useEffect(() => {
    if (!isActive) return;

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true);
        setCurrentGlitchText(Math.floor(Math.random() * glitchTexts.length));
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [isActive, glitchTexts.length]);

  const getLayerColor = () => {
    switch (reality.id) {
      case 'prime': return 'var(--reality-prime)';
      case 'alpha': return 'var(--reality-alpha)';
      case 'beta': return 'var(--reality-beta)';
      case 'gamma': return 'var(--reality-gamma)';
      default: return 'var(--reality-void)';
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0.1,
        scale: isActive ? 1 : 0.95,
        rotateY: isActive ? 0 : index * 5 - 10,
        z: isActive ? 0 : -index * 100
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      {/* Background reality field */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: isActive ? 
            `radial-gradient(circle at center, ${getLayerColor()}20 0%, transparent 70%)` :
            'transparent'
        }}
        animate={{
          opacity: isActive ? 1 : 0
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Main title */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold text-center mb-4 relative"
        style={{ color: getLayerColor() }}
        animate={{
          x: glitchActive ? [-2, 2, -2, 0] : 0,
          filter: glitchActive ? [
            'hue-rotate(0deg)',
            'hue-rotate(90deg)',
            'hue-rotate(-90deg)',
            'hue-rotate(0deg)'
          ] : 'hue-rotate(0deg)'
        }}
        transition={{ duration: 0.1 }}
      >
        {glitchActive ? glitchTexts[currentGlitchText] : reality.title}
        
        {/* Glitch layers */}
        {glitchActive && (
          <>
            <span
              className="absolute inset-0 text-center"
              style={{
                color: 'var(--reality-alpha)',
                transform: 'translateX(2px)',
                opacity: 0.8,
                mixBlendMode: 'screen'
              }}
            >
              {reality.title}
            </span>
            <span
              className="absolute inset-0 text-center"
              style={{
                color: 'var(--reality-beta)',
                transform: 'translateX(-2px)',
                opacity: 0.8,
                mixBlendMode: 'screen'
              }}
            >
              {reality.title}
            </span>
          </>
        )}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-center opacity-80 max-w-3xl mx-auto px-4"
        animate={{
          opacity: isActive ? 0.8 : 0.3,
          y: isActive ? 0 : 20
        }}
        transition={{ delay: 0.2 }}
      >
        {reality.description}
      </motion.p>

      {/* Reality indicator */}
      <motion.div
        className="absolute bottom-10 flex items-center space-x-2"
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getLayerColor() }}
        />
        <span className="text-sm uppercase tracking-wider opacity-60">
          Reality {reality.id.toUpperCase()}
        </span>
      </motion.div>

      {/* Quantum noise overlay */}
      {isActive && (
        <div className="reality-noise" />
      )}

      {/* Dimensional border */}
      <motion.div
        className="absolute inset-0 border-2 pointer-events-none"
        style={{ borderColor: getLayerColor() }}
        animate={{
          opacity: isActive ? [0, 0.3, 0] : 0,
          scale: isActive ? [0.98, 1.02, 0.98] : 1
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}