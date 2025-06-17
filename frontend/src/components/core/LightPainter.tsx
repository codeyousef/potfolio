import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LightPainterProps {
  children: React.ReactNode;
  trailColor?: string;
  trailIntensity?: number;
  particleCount?: number;
  fadeDuration?: number;
  enabled?: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  id: string;
}

interface ParticleBurst {
  x: number;
  y: number;
  timestamp: number;
  id: string;
}

const LightPainter: React.FC<LightPainterProps> = ({
  children,
  trailColor = '#38B2AC',
  trailIntensity = 0.8,
  particleCount = 8,
  fadeDuration = 1000,
  enabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [particleBursts, setParticleBursts] = useState<ParticleBurst[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  // Clean up old trail points
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrailPoints(prev => prev.filter(point => now - point.timestamp < fadeDuration));
      setParticleBursts(prev => prev.filter(burst => now - burst.timestamp < 2000));
    }, 100);

    return () => clearInterval(cleanup);
  }, [fadeDuration]);

  // Handle mouse movement for trail
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only add trail points if mouse is within container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const newPoint: TrailPoint = {
          x,
          y,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9),
        };

        setTrailPoints(prev => [...prev, newPoint]);
        setLastMousePosition({ x, y });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create particle burst on click
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const newBurst: ParticleBurst = {
          x,
          y,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9),
        };

        setParticleBursts(prev => [...prev, newBurst]);
      }
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled]);

  // Convert hex color to RGB values
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 56, g: 178, b: 172 }; // Default teal
  };

  const rgb = hexToRgb(trailColor);

  // Render trail points as connected lines
  const renderTrail = () => {
    if (trailPoints.length < 2) return null;

    const now = Date.now();
    const pathData = trailPoints.reduce((path, point, index) => {
      const age = now - point.timestamp;
      const opacity = Math.max(0, (fadeDuration - age) / fadeDuration) * trailIntensity;
      
      if (opacity <= 0) return path;

      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        return `${path} L ${point.x} ${point.y}`;
      }
    }, '');

    if (!pathData) return null;

    return (
      <svg
        className="absolute inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`} />
            <stop offset="50%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${trailIntensity})`} />
            <stop offset="100%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d={pathData}
          stroke="url(#trailGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(56, 178, 172, 0.6))',
          }}
        />
      </svg>
    );
  };

  // Render particle bursts on click
  const renderParticleBursts = () => {
    return particleBursts.map(burst => {
      const age = Date.now() - burst.timestamp;
      const progress = age / 2000;
      const opacity = Math.max(0, 1 - progress);

      if (opacity <= 0) return null;

      return (
        <div
          key={burst.id}
          className="absolute pointer-events-none z-40"
          style={{
            left: burst.x,
            top: burst.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Array.from({ length: particleCount }).map((_, i) => {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = progress * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: trailColor,
                  boxShadow: `0 0 6px ${trailColor}`,
                  opacity: opacity,
                }}
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{ 
                  x, 
                  y, 
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ 
                  duration: 2,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      );
    });
  };

  // Render thick energy beam for drag operations
  const renderDragBeam = () => {
    if (!isMouseDown || trailPoints.length < 2) return null;

    const startPoint = trailPoints[Math.max(0, trailPoints.length - 10)];
    const endPoint = lastMousePosition;

    return (
      <svg
        className="absolute inset-0 pointer-events-none z-45"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`} />
            <stop offset="50%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`} />
            <stop offset="100%" stopColor={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`} />
          </linearGradient>
        </defs>
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke="url(#beamGradient)"
          strokeWidth="4"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(56, 178, 172, 0.8))',
          }}
        />
      </svg>
    );
  };

  if (!enabled) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div ref={containerRef} className="relative">
      {children}
      {renderTrail()}
      {renderDragBeam()}
      {renderParticleBursts()}
    </div>
  );
};

export default LightPainter;