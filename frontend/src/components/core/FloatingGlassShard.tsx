import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingGlassShardProps {
  children: React.ReactNode;
  position: { x: number; y: number }; // Percentage positions
  distanceFromPortal: number; // 100-400px
  rotation?: number; // -5 to +5 degrees
  shape?: 'triangle' | 'pentagon' | 'hexagon' | 'irregular';
  className?: string;
}

const FloatingGlassShard: React.FC<FloatingGlassShardProps> = ({
  children,
  position,
  distanceFromPortal,
  rotation = 0,
  shape = 'irregular',
  className = '',
}) => {
  const shardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate color intensity based on distance to portal
  const portalProximity = Math.max(0, 1 - (distanceFromPortal - 100) / 300);
  
  // Generate clip path based on shape
  const getClipPath = () => {
    switch (shape) {
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'hexagon':
        return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'irregular':
      default:
        // Generate random irregular shape
        const points = [];
        const numPoints = 6 + Math.floor(Math.random() * 3); // 6-8 points
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const variance = 0.2 + Math.random() * 0.3; // 20-50% variance
          const radius = 40 + Math.random() * 20; // 40-60% from center
          const x = 50 + Math.cos(angle) * radius * variance;
          const y = 50 + Math.sin(angle) * radius * variance;
          points.push(`${Math.max(5, Math.min(95, x))}% ${Math.max(5, Math.min(95, y))}%`);
        }
        return `polygon(${points.join(', ')})`;
    }
  };
  
  // Handle mouse movement for cursor attraction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);
  
  // Calculate cursor attraction offset
  const getCursorAttraction = () => {
    if (!isHovered || !shardRef.current) return { x: 0, y: 0 };
    
    const rect = shardRef.current.getBoundingClientRect();
    const shardCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - shardCenter.x, 2) + 
      Math.pow(mousePosition.y - shardCenter.y, 2)
    );
    
    const maxDistance = 100;
    const pullStrength = Math.max(0, 1 - distance / maxDistance) * 10;
    
    const directionX = (mousePosition.x - shardCenter.x) / distance;
    const directionY = (mousePosition.y - shardCenter.y) / distance;
    
    return {
      x: directionX * pullStrength,
      y: directionY * pullStrength,
    };
  };
  
  const attraction = getCursorAttraction();
  
  return (
    <motion.div
      ref={shardRef}
      className={`floating-glass-shard ${className}`}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        width: '280px',
        minHeight: '200px',
        zIndex: Math.floor(30 + portalProximity * 20),
      }}
      animate={{
        y: attraction.y !== 0 ? attraction.y : [0, -10, 0], // Floating animation or attraction
        rotate: [rotation, rotation + 2, rotation], // Gentle rotation
        x: attraction.x,
      }}
      transition={{
        y: { duration: 6, ease: 'easeInOut', repeat: Infinity },
        rotate: { duration: 10, ease: 'easeInOut', repeat: Infinity },
        x: { duration: 0.3, ease: 'easeOut' },
        y: { duration: 0.3, ease: 'easeOut' },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main shard container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath: getClipPath(),
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {/* Outer glass shell with bright edge */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(56, 178, 172, ${0.05 + portalProximity * 0.1}) 50%,
                rgba(44, 82, 130, ${0.03 + portalProximity * 0.05}) 100%
              )
            `,
            border: '2px solid rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px) brightness(1.1)',
            boxShadow: `
              0 0 ${20 + portalProximity * 30}px rgba(56, 178, 172, ${0.3 + portalProximity * 0.4}),
              inset 0 0 30px rgba(255, 255, 255, 0.1),
              inset 0 0 60px rgba(56, 178, 172, ${0.05 + portalProximity * 0.1})
            `,
            transition: 'all 0.3s ease',
          }}
        />
        
        {/* Light refraction effects */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(45deg, 
                rgba(255, 255, 255, 0.3) 0%, 
                transparent 30%,
                transparent 70%,
                rgba(56, 178, 172, 0.2) 100%
              )
            `,
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        {/* Content with slight distortion effect */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#FFFFFF',
            textShadow: '0 0 10px rgba(56, 178, 172, 0.6)',
            filter: 'brightness(1.1) contrast(1.05)',
            transform: `scale(${1 + portalProximity * 0.05})`,
            transition: 'all 0.3s ease',
          }}
        >
          {children}
        </div>
        
        {/* Chromatic aberration near portal */}
        {portalProximity > 0.5 && (
          <>
            {/* Red shift on left */}
            <div
              style={{
                position: 'absolute',
                left: '-2px',
                top: 0,
                width: '100%',
                height: '100%',
                clipPath: getClipPath(),
                border: '1px solid rgba(255, 0, 0, 0.3)',
                pointerEvents: 'none',
              }}
            />
            {/* Blue shift on right */}
            <div
              style={{
                position: 'absolute',
                right: '-2px',
                top: 0,
                width: '100%',
                height: '100%',
                clipPath: getClipPath(),
                border: '1px solid rgba(0, 100, 255, 0.3)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        
        {/* Particle emanation on hover */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(circle at center, 
                  transparent 60%, 
                  rgba(56, 178, 172, 0.1) 80%,
                  rgba(56, 178, 172, 0.3) 100%
                )
              `,
              animation: 'shard-glow 2s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      
      <style>{`
        @keyframes shard-glow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05);
          }
        }
        
        .floating-glass-shard {
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        }
        
        .floating-glass-shard:hover {
          filter: drop-shadow(0 15px 40px rgba(56, 178, 172, 0.4));
        }
      `}</style>
    </motion.div>
  );
};

export default FloatingGlassShard;