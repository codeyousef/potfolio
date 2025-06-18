'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type CursorPersonality = 'curious' | 'aggressive' | 'playful' | 'scared' | 'stuck';
type CursorShape = 'circle' | 'square' | 'star' | 'skull' | 'question';

export default function ChaosCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [personality, setPersonality] = useState<CursorPersonality>('curious');
  const [shape, setShape] = useState<CursorShape>('circle');
  const mousePos = useRef({ x: 0, y: 0 });
  const stuckPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;
    if (!cursor || !cursorInner) return;

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (!isStuck) {
        // Smooth following with minimal delay
        gsap.to(cursor, {
          x: e.clientX - 20,
          y: e.clientY - 20,
          duration: 0.1, // Much faster response
          ease: 'none' // No bounce/elastic for better tracking
        });
      } else {
        // Cursor fights against user movement (but less dramatically)
        const resistance = 0.8; // Higher resistance = less fighting
        const wobbleX = (Math.random() - 0.5) * 10; // Smaller wobble
        const wobbleY = (Math.random() - 0.5) * 10;
        
        gsap.to(cursor, {
          x: stuckPos.current.x + (e.clientX - stuckPos.current.x) * resistance + wobbleX,
          y: stuckPos.current.y + (e.clientY - stuckPos.current.y) * resistance + wobbleY,
          duration: 0.3, // Faster response even when stuck
          ease: 'power2.out'
        });
      }
    };

    // Handle element hover
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine cursor shape based on element
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        setShape('square');
        setPersonality('aggressive');
      } else if (target.classList.contains('interactive')) {
        setShape('star');
        setPersonality('playful');
      } else if (target.classList.contains('danger')) {
        setShape('skull');
        setPersonality('scared');
      } else if (target.classList.contains('secret')) {
        setShape('question');
        setPersonality('curious');
      }
      
      // Rarely get stuck on interesting elements (reduced frequency)
      if (Math.random() > 0.95 && !isStuck) {
        setIsStuck(true);
        stuckPos.current = { x: e.clientX - 20, y: e.clientY - 20 };
        setTimeout(() => {
          setIsStuck(false);
          // Cursor "escapes" quickly back to normal tracking
          gsap.to(cursor, {
            x: mousePos.current.x - 20,
            y: mousePos.current.y - 20,
            duration: 0.2,
            ease: 'power2.out'
          });
        }, 500 + Math.random() * 1000); // Shorter stuck duration
      }
    };

    // Personality timer - cursor gets bored
    const personalityTimer = setInterval(() => {
      if (!isStuck) {
        const personalities: CursorPersonality[] = ['curious', 'aggressive', 'playful', 'scared'];
        setPersonality(personalities[Math.floor(Math.random() * personalities.length)]);
      }
    }, 5000);

    // Idle animation - cursor moves on its own (but less frequently)
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!isStuck) {
          setPersonality('playful');
          // Very subtle autonomous movement
          const autonomousMove = () => {
            if (!isStuck) {
              const currentX = parseFloat(cursor.style.left) || 0;
              const currentY = parseFloat(cursor.style.top) || 0;
              gsap.to(cursor, {
                x: currentX + (Math.random() - 0.5) * 100, // Smaller movements
                y: currentY + (Math.random() - 0.5) * 100,
                duration: 3, // Slower movement
                ease: 'power2.inOut',
                onComplete: () => {
                  if (!isStuck) setTimeout(autonomousMove, 2000);
                }
              });
            }
          };
          autonomousMove();
        }
      }, 60000); // 60 seconds of idle (longer wait)
    };

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('mouseover', handleElementHover);
    
    // Initial position
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('mouseover', handleElementHover);
      clearInterval(personalityTimer);
      clearTimeout(idleTimer);
    };
  }, [isStuck, personality]);

  // Update cursor appearance based on shape
  const getCursorShape = () => {
    switch (shape) {
      case 'square':
        return 'rotate-45 rounded-none';
      case 'star':
        return 'cursor-star';
      case 'skull':
        return 'cursor-skull';
      case 'question':
        return 'cursor-question';
      default:
        return 'rounded-full';
    }
  };

  // Update cursor color based on personality
  const getCursorColor = () => {
    switch (personality) {
      case 'aggressive':
        return 'var(--violence-pink)';
      case 'playful':
        return 'var(--toxic-green)';
      case 'scared':
        return 'var(--warning-yellow)';
      case 'stuck':
        return 'var(--glitch-1)';
      default:
        return 'var(--ghost-white)';
    }
  };

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`chaos-cursor ${isStuck ? 'stuck' : ''}`}
      >
        <div 
          ref={cursorInnerRef}
          className={`chaos-cursor-inner ${getCursorShape()}`}
          style={{ borderColor: getCursorColor() }}
        >
          {shape === 'skull' && <span className="text-xs">💀</span>}
          {shape === 'question' && <span className="text-xs">?</span>}
          {shape === 'star' && <span className="text-xs">✦</span>}
        </div>
      </div>
      
      <style jsx>{`
        .cursor-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}</style>
    </>
  );
}