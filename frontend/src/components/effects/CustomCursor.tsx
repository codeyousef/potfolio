import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const { currentPhase } = useAethelframeStore();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseEnter = () => {
      setShowCursor(true);
    };
    
    const handleMouseLeave = () => {
      setShowCursor(false);
    };
    
    // Blink effect interval
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    // Track hover state on interactive elements
    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive');
      
      if (isInteractive) {
        setIsHovering(true);
      }
    };
    
    const handleElementMouseLeave = () => {
      setIsHovering(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementMouseEnter);
    document.addEventListener('mouseout', handleElementMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementMouseEnter);
      document.removeEventListener('mouseout', handleElementMouseLeave);
      clearInterval(cursorInterval);
    };
  }, []);
  
  // Different cursor styles based on the current phase
  const getCursorSize = () => {
    switch(currentPhase) {
      case 'seed': return { inner: 1, outer: 6 };
      case 'growth': return { inner: 1.5, outer: 7 };
      case 'bloom': return { inner: 2, outer: 8 };
      default: return { inner: 2, outer: 8 };
    }
  };
  
  const cursorSize = getCursorSize();
  
  return (
    <AnimatePresence>
      {showCursor && (
        <motion.div 
          className="fixed pointer-events-none z-50"
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: showCursor ? 1 : 0.5,
            scale: isHovering ? 1.5 : 1,
            transition: { duration: 0.15 }
          }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-teal-400"
            style={{ 
              width: `${cursorSize.inner}rem`, 
              height: `${cursorSize.inner}rem`,
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 border border-teal-400/50 rounded-full"
            style={{ 
              width: `${cursorSize.outer}rem`, 
              height: `${cursorSize.outer}rem`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: isHovering ? 1.2 : [1, 0.9, 1],
              opacity: isHovering ? 0.8 : [0.5, 0.3, 0.5],
              transition: {
                duration: isHovering ? 0.2 : 2,
                repeat: isHovering ? 0 : Infinity,
                repeatType: "loop"
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;