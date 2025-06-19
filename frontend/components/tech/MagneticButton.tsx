'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
}

export default function MagneticButton({ children }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Magnetic effect within radius
      const radius = 100;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      if (distance < radius) {
        const force = (radius - distance) / radius;
        setPosition({
          x: distanceX * force * 0.3,
          y: distanceY * force * 0.3
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      ref={buttonRef}
      animate={position}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15,
        mass: 0.1
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}