import React, { useEffect, useMemo, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  pulsePhase: number;
}

interface FloatingParticlesProps {
  count?: number;
  portalPosition?: { x: number; y: number };
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 250,
  portalPosition = { x: 50, y: 50 }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Brand colors for particles
  const brandColors = [
    '#38B2AC', // Teal
    '#2C5282', // Navy
    '#9B2C2C', // Maroon
    '#00D4FF', // Electric blue
    '#FFFFFF', // White
  ];
  
  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100, // Start below screen
      size: Math.random() * 2 + 1, // 1-3px
      color: brandColors[Math.floor(Math.random() * brandColors.length)],
      speed: Math.random() * 0.3 + 0.1, // 0.1-0.4 speed units  
      opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5 opacity (more subtle)
      pulsePhase: Math.random() * Math.PI * 2,
    }));
  }, [count]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    let animationFrame: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      particles.forEach(particle => {
        const element = document.getElementById(`particle-${particle.id}`);
        if (!element) return;
        
        // Calculate distance to portal for speed modification
        const distanceToPortal = Math.sqrt(
          Math.pow(particle.x - portalPosition.x, 2) + 
          Math.pow(particle.y - portalPosition.y, 2)
        );
        
        // Particles move faster when near portal
        const portalEffect = Math.max(0.5, 1 - (distanceToPortal / 100));
        const effectiveSpeed = particle.speed * (1 + portalEffect * 2);
        
        // Update Y position (drift upward)
        particle.y -= effectiveSpeed;
        
        // Subtle horizontal drift
        const horizontalDrift = Math.sin(elapsed * 0.5 + particle.pulsePhase) * 0.1;
        const currentX = particle.x + horizontalDrift;
        
        // Reset particle when it goes off screen
        if (particle.y < -10) {
          particle.y = 110;
          particle.x = Math.random() * 100;
        }
        
        // Pulsing glow effect
        const pulseIntensity = (Math.sin(elapsed * 2 + particle.pulsePhase) + 1) / 2;
        const currentOpacity = particle.opacity * (0.6 + pulseIntensity * 0.4);
        
        // Apply position and effects
        element.style.left = `${currentX}%`;
        element.style.top = `${particle.y}%`;
        element.style.opacity = currentOpacity.toString();
        element.style.transform = `scale(${0.8 + pulseIntensity * 0.4})`;
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [particles, portalPosition]);
  
  return (
    <div 
      ref={containerRef}
      className="floating-particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          id={`particle-${particle.id}`}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            filter: 'blur(0.5px)',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
      
      <style>{`
        .floating-particles {
          /* Ensure particles blend nicely with background */
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  );
};

export default FloatingParticles;