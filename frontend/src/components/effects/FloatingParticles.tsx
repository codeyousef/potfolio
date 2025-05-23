import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';

interface ParticleProps {
  size: number;
  color: string;
  top: number;
  left: number;
  delay: number;
  duration: number;
}

const Particle: React.FC<ParticleProps> = ({ size, color, top, left, delay, duration }) => {
  const { currentPhase } = useAethelframeStore();
  
  // Different animation variants based on the current phase
  const getVariants = () => {
    const baseVariant = {
      initial: { 
        opacity: 0, 
        y: 20,
        x: 0
      },
      animate: { 
        opacity: [0, 0.15, 0.1, 0.15, 0],
        y: [-20, 20, -10, -20],
        x: [-5, 5, -5, 5, -5],
        transition: { 
          duration, 
          delay,
          repeat: Infinity,
          repeatType: "loop" as const,
          ease: "easeInOut"
        }
      }
    };
    
    switch(currentPhase) {
      case 'seed':
        return {
          ...baseVariant,
          animate: {
            ...baseVariant.animate,
            opacity: [0, 0.08, 0.05, 0.08, 0],
            transition: {
              ...baseVariant.animate.transition,
              duration: duration * 1.5
            }
          }
        };
      case 'growth':
        return {
          ...baseVariant,
          animate: {
            ...baseVariant.animate,
            opacity: [0, 0.12, 0.08, 0.12, 0],
            transition: {
              ...baseVariant.animate.transition,
              duration: duration * 1.2
            }
          }
        };
      case 'bloom':
      default:
        return baseVariant;
    }
  };
  
  const variants = getVariants();
  
  return (
    <motion.div
      className="absolute rounded-full mix-blend-screen"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        top: `${top}%`,
        left: `${left}%`,
        filter: 'blur(1px)'
      }}
      variants={variants}
      initial="initial"
      animate="animate"
    />
  );
};

interface FloatingParticlesProps {
  count?: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ count = 20 }) => {
  const { currentPhase } = useAethelframeStore();
  
  // Generate random particles
  const particles = useMemo(() => {
    // Adjust particle count based on phase
    let adjustedCount = count;
    if (currentPhase === 'seed') adjustedCount = Math.floor(count * 0.5);
    if (currentPhase === 'growth') adjustedCount = Math.floor(count * 0.8);
    
    return Array.from({ length: adjustedCount }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      color: i % 3 === 0 ? '#be123c' : i % 3 === 1 ? '#1e3a8a' : '#5eead4',
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 5,
      top: Math.random() * 100,
      left: Math.random() * 100
    }));
  }, [count, currentPhase]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(particle => (
        <Particle
          key={particle.id}
          size={particle.size}
          color={particle.color}
          top={particle.top}
          left={particle.left}
          delay={particle.delay}
          duration={particle.duration}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;