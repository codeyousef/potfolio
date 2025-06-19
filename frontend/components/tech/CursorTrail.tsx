'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CursorTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const idRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add point to trail
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: idRef.current++
      };
      
      setTrail(prev => [...prev.slice(-20), newPoint]);
    };

    const animate = () => {
      // Remove old trail points
      setTrail(prev => {
        const now = Date.now();
        return prev.filter((_, index) => index > prev.length - 20);
      });
      
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed w-5 h-5 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          transition: 'none'
        }}
      >
        <div className="w-full h-full rounded-full bg-ai-blue opacity-80" />
      </div>

      {/* Trail */}
      <svg className="fixed inset-0 pointer-events-none z-[9998]" style={{ mixBlendMode: 'screen' }}>
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {trail.length > 1 && (
          <motion.path
            d={`M ${trail.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </svg>

      {/* Cursor glow effect */}
      <div
        className="fixed w-32 h-32 pointer-events-none z-[9997]"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
          transition: 'none'
        }}
      />
    </>
  );
}