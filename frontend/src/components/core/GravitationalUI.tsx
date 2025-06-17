import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GravitationalUIProps {
  children: React.ReactNode;
  portalPosition?: { x: number; y: number };
  gravitationalStrength?: number;
  repulsionRadius?: number;
  attractionRadius?: number;
  magneticSnapping?: boolean;
}

// Advanced Gravitational UI Component
export const GravitationalUI: React.FC<GravitationalUIProps> = ({
  children,
  portalPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  gravitationalStrength = 0.8,
  repulsionRadius = 100,
  attractionRadius = 200,
  magneticSnapping = true,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Motion values for smooth physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for natural movement
  const springX = useSpring(x, { 
    stiffness: 150, 
    damping: 20, 
    mass: 1.2 
  });
  const springY = useSpring(y, { 
    stiffness: 150, 
    damping: 20, 
    mass: 1.2 
  });
  
  // Transform based on portal proximity
  const scale = useTransform([springX, springY], ([currentX, currentY]) => {
    const distance = Math.sqrt(
      Math.pow(currentX - portalPosition.x, 2) + 
      Math.pow(currentY - portalPosition.y, 2)
    );
    const proximityFactor = Math.max(0, 1 - distance / attractionRadius);
    return 1 + proximityFactor * 0.1;
  });
  
  const rotation = useTransform([springX, springY], ([currentX, currentY]) => {
    const distance = Math.sqrt(
      Math.pow(currentX - portalPosition.x, 2) + 
      Math.pow(currentY - portalPosition.y, 2)
    );
    const proximityFactor = Math.max(0, 1 - distance / attractionRadius);
    return proximityFactor * 2 * (Math.random() - 0.5);
  });
  
  // Physics simulation
  useEffect(() => {
    let animationFrame: number;
    
    const updatePhysics = () => {
      if (!elementRef.current || isDragging) return;
      
      const currentX = x.get();
      const currentY = y.get();
      
      // Calculate forces
      let forceX = 0;
      let forceY = 0;
      
      // 1. Gravitational attraction to portal (when idle)
      const distanceToPortal = Math.sqrt(
        Math.pow(currentX - portalPosition.x, 2) + 
        Math.pow(currentY - portalPosition.y, 2)
      );
      
      if (distanceToPortal > attractionRadius) {
        const portalForceX = (portalPosition.x - currentX) / distanceToPortal;
        const portalForceY = (portalPosition.y - currentY) / distanceToPortal;
        forceX += portalForceX * gravitationalStrength * 0.3;
        forceY += portalForceY * gravitationalStrength * 0.3;
      }
      
      // 2. Cursor repulsion
      const distanceToCursor = Math.sqrt(
        Math.pow(currentX - mousePosition.x, 2) + 
        Math.pow(currentY - mousePosition.y, 2)
      );
      
      if (distanceToCursor < repulsionRadius) {
        const repulsionForce = (repulsionRadius - distanceToCursor) / repulsionRadius;
        const repulsionX = (currentX - mousePosition.x) / distanceToCursor;
        const repulsionY = (currentY - mousePosition.y) / distanceToCursor;
        forceX += repulsionX * repulsionForce * gravitationalStrength;
        forceY += repulsionY * repulsionForce * gravitationalStrength;
      }
      
      // 3. Magnetic snapping to orbital positions
      if (magneticSnapping) {
        const orbitalRadii = [150, 300, 450]; // Three orbital rings
        const closestRadius = orbitalRadii.reduce((prev, curr) => 
          Math.abs(curr - distanceToPortal) < Math.abs(prev - distanceToPortal) ? curr : prev
        );
        
        if (Math.abs(distanceToPortal - closestRadius) < 50) {
          const targetX = portalPosition.x + (currentX - portalPosition.x) * (closestRadius / distanceToPortal);
          const targetY = portalPosition.y + (currentY - portalPosition.y) * (closestRadius / distanceToPortal);
          forceX += (targetX - currentX) * 0.1;
          forceY += (targetY - currentY) * 0.1;
        }
      }
      
      // Apply forces
      x.set(currentX + forceX);
      y.set(currentY + forceY);
      
      animationFrame = requestAnimationFrame(updatePhysics);
    };
    
    updatePhysics();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [x, y, mousePosition, portalPosition, isDragging, gravitationalStrength, repulsionRadius, attractionRadius, magneticSnapping]);
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <motion.div
      ref={elementRef}
      style={{
        x: springX,
        y: springY,
        scale,
        rotate: rotation,
      }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ 
        scale: 1.1,
        zIndex: 1000,
        transition: { duration: 0.2 }
      }}
      className="absolute will-change-transform"
    >
      {children}
    </motion.div>
  );
};

// Light Painter Component for cursor trails
interface LightPainterProps {
  children: React.ReactNode;
  trailColor?: string;
  trailIntensity?: number;
  particleCount?: number;
  enabled?: boolean;
}

export const LightPainter: React.FC<LightPainterProps> = ({
  children,
  trailColor = '#38B2AC',
  trailIntensity = 0.8,
  particleCount = 15,
  enabled = true,
}) => {
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number; timestamp: number }>>([]);
  const [clicks, setClicks] = useState<Array<{ x: number; y: number; id: number; timestamp: number }>>([]);
  const trailIdRef = useRef(0);
  const clickIdRef = useRef(0);
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current++,
        timestamp: Date.now(),
      };
      
      setTrails(prev => [...prev.slice(-particleCount), newTrail]);
    };
    
    const handleClick = (e: MouseEvent) => {
      const newClick = {
        x: e.clientX,
        y: e.clientY,
        id: clickIdRef.current++,
        timestamp: Date.now(),
      };
      
      setClicks(prev => [...prev, newClick]);
      
      // Remove click after animation
      setTimeout(() => {
        setClicks(prev => prev.filter(click => click.id !== newClick.id));
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [enabled, particleCount]);
  
  // Clean old trails
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(trail => now - trail.timestamp < 500));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      {children}
      
      {/* Cursor Trails */}
      {enabled && trails.map((trail, index) => {
        const age = (Date.now() - trail.timestamp) / 500;
        const opacity = (1 - age) * trailIntensity;
        const scale = 1 - age * 0.8;
        
        return (
          <motion.div
            key={trail.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: trail.x,
              top: trail.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity,
              scale,
            }}
            transition={{ duration: 0.1 }}
          >
            <div
              className="w-3 h-3 rounded-full blur-sm"
              style={{
                background: `radial-gradient(circle, ${trailColor} 0%, transparent 70%)`,
                boxShadow: `0 0 10px ${trailColor}`,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Click Explosions */}
      {enabled && clicks.map(click => (
        <motion.div
          key={click.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: click.x,
            top: click.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 2, 4],
            opacity: [1, 0.6, 0],
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
        >
          {/* Particle burst */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 50;
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: trailColor,
                  boxShadow: `0 0 6px ${trailColor}`,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  opacity: 1 
                }}
                animate={{ 
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut",
                  delay: i * 0.02
                }}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

// Dimensional Transition Component
interface DimensionalTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'in' | 'out';
}

export const DimensionalTransition: React.FC<DimensionalTransitionProps> = ({
  isVisible,
  onComplete,
  direction = 'in',
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      onAnimationComplete={onComplete}
    >
      {/* Portal fragmentation effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(56, 178, 172, 0.1) 0%, transparent 70%)',
        }}
        initial={{ scale: direction === 'in' ? 0 : 1 }}
        animate={{ scale: direction === 'in' ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Lightning strikes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: `${Math.random() * 200 + 100}px`,
            background: 'linear-gradient(to bottom, #38B2AC, transparent)',
            transform: `rotate(${Math.random() * 360}deg)`,
            filter: 'blur(1px)',
            boxShadow: '0 0 10px #38B2AC',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scaleY: [0, 1, 1],
          }}
          transition={{ 
            duration: 0.3,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

export default GravitationalUI;