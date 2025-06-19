'use client';

import { useEffect, useRef, useState } from 'react';

interface CursorEcho {
  id: number;
  x: number;
  y: number;
  opacity: number;
  color: string;
  scale: number;
}

export default function QuantumCursor() {
  const [primaryPosition, setPrimaryPosition] = useState({ x: 0, y: 0 });
  const [echoes, setEchoes] = useState<CursorEcho[]>([]);
  const echoIdRef = useRef(0);
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor
    document.body.classList.add('quantum-cursor-active');
    
    const colors = ['#FF006E', '#00F5FF', '#FFE500', '#A8FF00'];
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      
      // Calculate velocity
      mouseVelocityRef.current = {
        x: newX - lastPositionRef.current.x,
        y: newY - lastPositionRef.current.y
      };
      
      lastPositionRef.current = { x: newX, y: newY };
      setPrimaryPosition({ x: newX, y: newY });
      
      // Create quantum echoes based on velocity
      const speed = Math.sqrt(
        mouseVelocityRef.current.x ** 2 + 
        mouseVelocityRef.current.y ** 2
      );
      
      if (speed > 5) {
        const echoCount = Math.min(Math.floor(speed / 10), 5);
        
        for (let i = 0; i < echoCount; i++) {
          const echo: CursorEcho = {
            id: echoIdRef.current++,
            x: newX + (Math.random() - 0.5) * speed,
            y: newY + (Math.random() - 0.5) * speed,
            opacity: 0.8 - i * 0.15,
            color: colors[Math.floor(Math.random() * colors.length)],
            scale: 1 - i * 0.1
          };
          
          setEchoes(prev => [...prev, echo]);
          
          // Remove echo after animation
          setTimeout(() => {
            setEchoes(prev => prev.filter(e => e.id !== echo.id));
          }, 1000);
        }
      }
    };
    
    const handleMouseLeave = () => {
      // Create explosion of echoes when cursor leaves
      const explosionCount = 10;
      for (let i = 0; i < explosionCount; i++) {
        const angle = (i / explosionCount) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        
        const echo: CursorEcho = {
          id: echoIdRef.current++,
          x: lastPositionRef.current.x + Math.cos(angle) * distance,
          y: lastPositionRef.current.y + Math.sin(angle) * distance,
          opacity: 0.6,
          color: colors[i % colors.length],
          scale: 0.8
        };
        
        setEchoes(prev => [...prev, echo]);
        
        setTimeout(() => {
          setEchoes(prev => prev.filter(e => e.id !== echo.id));
        }, 1500);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('quantum-cursor-active');
    };
  }, []);

  return (
    <>
      {/* Primary cursor */}
      <div 
        className="quantum-cursor primary"
        style={{
          left: primaryPosition.x,
          top: primaryPosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Quantum echoes */}
      {echoes.map(echo => (
        <div
          key={echo.id}
          className="quantum-cursor-echo"
          style={{
            left: echo.x,
            top: echo.y,
            opacity: echo.opacity,
            background: echo.color,
            transform: `translate(-50%, -50%) scale(${echo.scale})`,
            boxShadow: `0 0 20px ${echo.color}`
          }}
        />
      ))}
      
      {/* Quantum probability field */}
      <svg 
        className="fixed inset-0 pointer-events-none" 
        style={{ zIndex: 9998 }}
      >
        <defs>
          <filter id="quantum-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <radialGradient id="quantum-gradient">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Cursor trail */}
        <circle
          cx={primaryPosition.x}
          cy={primaryPosition.y}
          r="30"
          fill="url(#quantum-gradient)"
          filter="url(#quantum-blur)"
          opacity="0.3"
        />
        
        {/* Quantum field distortion */}
        {echoes.map(echo => (
          <circle
            key={`field-${echo.id}`}
            cx={echo.x}
            cy={echo.y}
            r="15"
            fill={echo.color}
            filter="url(#quantum-blur)"
            opacity={echo.opacity * 0.3}
          />
        ))}
      </svg>
    </>
  );
}