'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  id: string;
  xStart: string;
  yStart: string;
  xEnd: string;
  yEnd: string;
  size: number;
  animationDelay: string;
  animationDuration: string;
}

const NUM_PARTICLES = 15; // As per mockup script

const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: ParticleProps[] = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        newParticles.push({
          id: `particle-${i}`,
          xStart: `${Math.random() * 100}vw`,
          yStart: `${Math.random() * 100}vh`,
          xEnd: `${Math.random() * 100}vw`,
          yEnd: `${Math.random() * 100}vh`,
          size: Math.random() * 1.5 + 0.2, // 0.2px to 1.7px
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${Math.random() * 15 + 15}s`, // 15s to 30s
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-0"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: 'var(--secondary-accent)', // Use CSS variable
            left: '0%', // Initial CSS left, transform will handle actual position
            top: '0%',  // Initial CSS top, transform will handle actual position
            animationName: 'driftAndFade', // CSS keyframe animation
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
            // Pass CSS variables for the animation to use
            ['--x-start' as any]: particle.xStart,
            ['--y-start' as any]: particle.yStart,
            ['--x-end' as any]: particle.xEnd,
            ['--y-end' as any]: particle.yEnd,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
