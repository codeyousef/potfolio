import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAethelframeStore } from '../../store/useAethelframeStore';

interface ParticleAccentProps {
  count?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const ParticleAccent = ({ count = 15 }: ParticleAccentProps) => {
  const { currentPhase } = useAethelframeStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate random particles
  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, index) => ({
      id: index,
      x: Math.random() * 100, // percentage of container width
      y: Math.random() * 100, // percentage of container height
      size: Math.random() * 3 + 1, // between 1px and 4px
      opacity: Math.random() * 0.5 + 0.1, // between 0.1 and 0.6
      duration: Math.random() * 20 + 10, // between 10s and 30s
      delay: Math.random() * 5, // between 0s and 5s
    }));
    
    setParticles(newParticles);
  }, [count]);
  
  // Adjust particle appearance based on phase
  const getParticleColor = () => {
    switch(currentPhase) {
      case 'seed': return 'rgba(226, 200, 160, 0.3)'; // Dimmer in seed phase
      case 'growth': return 'rgba(226, 200, 160, 0.5)'; // Brighter in growth
      case 'bloom': return 'rgba(226, 200, 160, 0.7)'; // Brightest in bloom
      default: return 'rgba(226, 200, 160, 0.5)';
    }
  };
  
  return (
    <div className="particle-container absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: getParticleColor(),
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            opacity: [
              particle.opacity,
              particle.opacity * 0.7,
              particle.opacity * 0.9,
              particle.opacity
            ]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleAccent;