'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas } from '@/context/CanvasContext';
import { useEmergence } from '@/context/EmergenceContext';

/**
 * ContactBeacon - A subtle, persistent indicator that allows quick navigation to the contact canvas
 * Adapts its appearance based on the current emergence phase
 */
const ContactBeacon: React.FC = () => {
  const { activeCanvas, setActiveCanvas } = useCanvas();
  const { currentPhase } = useEmergence();
  const [isHovered, setIsHovered] = useState(false);
  
  // Don't show when already on contact canvas
  if (activeCanvas === 'contact') return null;
  
  // Get phase-specific styles
  const getBeaconStyles = () => {
    const baseClasses = "fixed bottom-6 right-6 w-3 h-3 rounded-full flex items-center justify-center z-30 cursor-pointer";
    
    switch (currentPhase) {
      case 'seed':
        return `${baseClasses} border border-seed-accent`;
      case 'growth':
        return `${baseClasses} border border-growth-accent`;
      case 'bloom':
        return `${baseClasses} border border-bloom-accent`;
      default:
        return `${baseClasses} border border-seed-accent`;
    }
  };
  
  // Get ripple effect color based on phase
  const getRippleColor = () => {
    switch (currentPhase) {
      case 'seed':
        return 'rgba(0, 115, 230, 0.2)'; // seed-accent with opacity
      case 'growth':
        return 'rgba(80, 227, 194, 0.2)'; // growth-accent with opacity
      case 'bloom':
        return 'rgba(255, 255, 255, 0.2)'; // bloom-accent with opacity
      default:
        return 'rgba(0, 115, 230, 0.2)';
    }
  };

  // Animation variants
  const beaconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 0.8,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: { 
      scale: 1.2, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };
  
  const rippleVariants = {
    animate: {
      scale: [1, 1.8],
      opacity: [0.3, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };
  
  // Label variants
  const labelVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 0.8, 
      x: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      className={getBeaconStyles()}
      variants={beaconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setActiveCanvas('contact')}
      aria-label="Navigate to contact"
    >
      {/* Inner dot */}
      <motion.div 
        className="w-1.5 h-1.5 rounded-full"
        style={{ 
          backgroundColor: 
            currentPhase === 'seed' ? 'var(--seed-accent)' : 
            currentPhase === 'growth' ? 'var(--growth-accent)' : 
            'var(--bloom-accent)' 
        }}
      />
      
      {/* Ripple effect */}
      <motion.div
        className="absolute w-full h-full rounded-full"
        style={{ backgroundColor: getRippleColor() }}
        variants={rippleVariants}
        animate="animate"
      />
      
      {/* "Contact" label on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-full mr-2 text-xs font-mono tracking-wide opacity-80"
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            Contact
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactBeacon;
