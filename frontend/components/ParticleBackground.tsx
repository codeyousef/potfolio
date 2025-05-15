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
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  phase?: 'seed' | 'growth' | 'bloom';
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ phase = 'seed' }) => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  // Phase-specific configurations
  const phaseConfig = useMemo(() => {
    switch (phase) {
      case 'seed':
        return {
          numParticles: 15,
          minSize: 0.2,
          maxSize: 1.7,
          minDuration: 15,
          maxDuration: 30,
          minOpacity: 0.2,
          maxOpacity: 0.5,
          colors: ['var(--seed-accent)'],
          blendMode: 'screen' as const,
        };
      case 'growth':
        return {
          numParticles: 25,
          minSize: 0.3,
          maxSize: 2.2,
          minDuration: 12,
          maxDuration: 25,
          minOpacity: 0.3,
          maxOpacity: 0.6,
          colors: ['var(--growth-accent)', 'var(--seed-accent)'],
          blendMode: 'screen' as const,
        };
      case 'bloom':
        return {
          numParticles: 35,
          minSize: 0.5,
          maxSize: 2.5,
          minDuration: 10,
          maxDuration: 20,
          minOpacity: 0.4,
          maxOpacity: 0.7,
          colors: ['var(--bloom-accent)', 'var(--growth-accent)', 'var(--seed-accent)'],
          blendMode: 'lighten' as const,
        };
      default:
        return {
          numParticles: 15,
          minSize: 0.2,
          maxSize: 1.7,
          minDuration: 15,
          maxDuration: 30,
          minOpacity: 0.2,
          maxOpacity: 0.5,
          colors: ['var(--seed-accent)'],
          blendMode: 'screen' as const,
        };
    }
  }, [phase]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: ParticleProps[] = [];
      const { 
        numParticles, 
        minSize, 
        maxSize, 
        minDuration, 
        maxDuration,
        minOpacity,
        maxOpacity,
        colors 
      } = phaseConfig;
      
      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: `particle-${i}`,
          xStart: `${Math.random() * 100}vw`,
          yStart: `${Math.random() * 100}vh`,
          xEnd: `${Math.random() * 100}vw`,
          yEnd: `${Math.random() * 100}vh`,
          size: Math.random() * (maxSize - minSize) + minSize,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
          opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [phase, phaseConfig]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ mixBlendMode: phaseConfig.blendMode }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full transition-all duration-1000`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            left: '0%',
            top: '0%',
            filter: phase === 'bloom' ? 'blur(0.5px)' : 'none',
            boxShadow: phase === 'bloom' ? `0 0 ${particle.size * 2}px ${particle.color}` : 'none', 
            animationName: 'driftAndFade',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
            ['--x-start' as any]: particle.xStart,
            ['--y-start' as any]: particle.yStart,
            ['--x-end' as any]: particle.xEnd,
            ['--y-end' as any]: particle.yEnd,
          }}
        />
      ))}

      {/* Add phase-specific ambient glow for Bloom phase */}
      {phase === 'bloom' && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-bloom-accent/5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default ParticleBackground;
