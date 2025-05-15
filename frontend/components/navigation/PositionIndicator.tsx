'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCanvas } from '@/context/CanvasContext';
import { useEmergence } from '@/context/EmergenceContext';

/**
 * PositionIndicator - Shows the current canvas position in the journey
 * Changes style based on current emergence phase
 */
const PositionIndicator: React.FC = () => {
  const { activeCanvas } = useCanvas();
  const { currentPhase } = useEmergence();
  
  // Canvas order in the navigation sequence
  const canvasOrder = ['home', 'portfolio', 'services', 'journal', 'contact'];
  const activeIndex = canvasOrder.indexOf(activeCanvas || 'home');
  
  // Styles based on current phase
  const getIndicatorStyle = () => {
    switch (currentPhase) {
      case 'seed':
        return 'border-seed-accent bg-transparent';
      case 'growth':
        return 'border-growth-accent bg-transparent';
      case 'bloom':
        return 'border-bloom-accent bg-transparent';
      default:
        return 'border-seed-accent bg-transparent';
    }
  };
  
  const getActiveIndicatorStyle = () => {
    switch (currentPhase) {
      case 'seed':
        return 'bg-seed-accent';
      case 'growth':
        return 'bg-growth-accent';
      case 'bloom':
        return 'bg-bloom-accent';
      default:
        return 'bg-seed-accent';
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-30">
      {canvasOrder.map((canvas, index) => (
        <motion.div
          key={canvas}
          className={`w-2 h-2 rounded-full border ${
            index === activeIndex 
              ? getActiveIndicatorStyle() 
              : getIndicatorStyle()
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: index === activeIndex ? 1 : 0.5,
            scale: index === activeIndex ? 1 : 0.8
          }}
          transition={{ 
            duration: 0.3,
            ease: currentPhase === 'bloom' 
              ? [0.34, 1.56, 0.64, 1] 
              : [0.16, 1, 0.3, 1]
          }}
          aria-label={`${canvas} canvas position indicator ${index === activeIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default PositionIndicator;
