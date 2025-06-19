'use client';

import { useEffect, useRef } from 'react';

export default function LuxuryCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const animationId = useRef<number>();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    
    // Animation loop for smooth following
    const animate = () => {
      // Smooth easing
      currentX.current += (mouseX.current - currentX.current) * 0.05;
      currentY.current += (mouseY.current - currentY.current) * 0.05;
      
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px) translate(-50%, -50%)`;
      }
      
      animationId.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 50,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 50%)',
        filter: 'blur(40px)',
        opacity: 0.8,
        left: 0,
        top: 0,
      }}
    />
  );
}