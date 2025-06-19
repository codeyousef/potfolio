'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function VirusCursor() {
  const infectedElements = useRef(new Set<HTMLElement>());
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update custom cursor position
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }

      // Create glitch trail
      const trail = document.createElement('div');
      trail.className = 'virus-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.width = Math.random() * 20 + 10 + 'px';
      trail.style.height = '2px';
      trail.style.background = `hsl(${Math.random() * 60 + 120}, 100%, 50%)`;
      document.body.appendChild(trail);
      
      // Fade out trail
      gsap.to(trail, {
        opacity: 0,
        scaleX: 0,
        duration: 1,
        onComplete: () => trail.remove()
      });
      
      // Check what element we're over
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element instanceof HTMLElement && !infectedElements.current.has(element)) {
        if (Math.random() > 0.95) { // 5% chance to infect
          infectElement(element);
        }
      }
    };
    
    const infectElement = (element: HTMLElement) => {
      infectedElements.current.add(element);
      
      // Store original styles
      const originalAnimation = element.style.animation;
      const originalColor = element.style.color;
      
      // Apply corruption effect
      element.style.animation = 'glitch 0.3s infinite';
      element.style.color = '#00FF41';
      
      // Spread to neighboring elements
      setTimeout(() => {
        const siblings = [...(element.parentElement?.children || [])] as HTMLElement[];
        siblings.forEach(sibling => {
          if (Math.random() > 0.7 && !infectedElements.current.has(sibling)) {
            infectElement(sibling);
          }
        });
      }, 100);
      
      // "Heal" after random time
      setTimeout(() => {
        element.style.animation = originalAnimation;
        element.style.color = originalColor;
        infectedElements.current.delete(element);
      }, Math.random() * 5000 + 2000);
    };

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-4 h-4"
        style={{
          transform: 'translate(-50%, -50%)',
          transition: 'none'
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: '#00FF41',
            boxShadow: '0 0 10px #00FF41, 0 0 20px #00FF41',
            animation: 'pulse 1s infinite'
          }}
        />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: '#00FF41',
            animation: 'ping 1s infinite',
            opacity: 0.5
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}