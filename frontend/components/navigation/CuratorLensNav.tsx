'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas, CanvasId } from '../../context/CanvasContext';
import { useEmergence } from '../../context/EmergenceContext';

interface NavItemDef {
  id: CanvasId;
  label: string;
}

const CuratorLensNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeCanvas, setActiveCanvas } = useCanvas();
  const { currentPhase } = useEmergence();

  const navItems: NavItemDef[] = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Atelier' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  // Handle navigation when a menu item is clicked
  const handleNavigation = (canvasId: CanvasId) => {
    setActiveCanvas(canvasId);
    setIsOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Get phase-based styling
  const getPhaseStyles = () => {
    // Button borders
    const buttonBorder = 
      currentPhase === 'seed' ? 'border-white/10 hover:border-seed-accent' :
      currentPhase === 'growth' ? 'border-white/20 hover:border-growth-accent' :
      'border-white/30 hover:border-bloom-accent';
    
    // Button active state
    const buttonActive =
      currentPhase === 'seed' ? 'border-seed-accent' :
      currentPhase === 'growth' ? 'border-growth-accent' :
      'border-bloom-accent';
    
    // Icon colors
    const iconColor =
      currentPhase === 'seed' ? 'bg-seed-accent shadow-[0_0_5px_var(--seed-accent)]' :
      currentPhase === 'growth' ? 'bg-growth-accent shadow-[0_0_5px_var(--growth-accent)]' :
      'bg-bloom-accent shadow-[0_0_5px_var(--bloom-accent)]';
    
    // Active text color
    const activeTextColor =
      currentPhase === 'seed' ? 'text-seed-accent' :
      currentPhase === 'growth' ? 'text-growth-accent' :
      'text-bloom-accent';
    
    // Text shadow for active items
    const activeTextShadow =
      currentPhase === 'seed' ? 'text-shadow-[0_0_8px_var(--seed-accent)]' :
      currentPhase === 'growth' ? 'text-shadow-[0_0_8px_var(--growth-accent)]' :
      'text-shadow-[0_0_8px_var(--bloom-accent)]';
    
    // Background for position indicator
    const positionIndicatorBg = 
      currentPhase === 'seed' ? 'bg-seed-bg' :
      currentPhase === 'growth' ? 'bg-growth-bg' :
      'bg-bloom-bg';
    
    return {
      buttonBorder,
      buttonActive,
      iconColor,
      activeTextColor,
      activeTextShadow,
      positionIndicatorBg
    };
  };

  const styles = getPhaseStyles();

  // Animation variants for nav container - adapts to the phase
  const navContainerVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: currentPhase === 'seed' ? 0.12 : currentPhase === 'growth' ? 0.1 : 0.08,
        when: 'beforeChildren',
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      },
    },
  };

  // Animation variants for individual nav items
  const navItemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
      transition: { 
        duration: currentPhase === 'seed' ? 0.3 : currentPhase === 'growth' ? 0.25 : 0.2,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: currentPhase === 'seed' ? 0.4 : currentPhase === 'growth' ? 0.35 : 0.3,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      },
    },
  };

  return (
    <>
      {/* Position indicator - shows current location in the experience */}
      <motion.div 
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ${styles.positionIndicatorBg} py-3 px-8 border border-transparent`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className={`font-heading text-sm tracking-wider ${styles.activeTextColor}`}>
          {activeCanvas.charAt(0).toUpperCase() + activeCanvas.slice(1)}
        </span>
      </motion.div>

      {/* Orbital Navigator (bottom left) */}
      <div className="fixed bottom-12 left-12 z-[100]">
        <motion.button
          onClick={toggleMenu}
          className={`w-9 h-9 bg-transparent border ${styles.buttonBorder} rounded-full flex items-center justify-center focus:outline-none shadow-lg transition-all duration-700 ${isOpen ? styles.buttonActive : ''}`}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          whileHover={{ 
            scale: 1.2, 
            rotate: -15
          }}
          transition={{ 
            duration: currentPhase === 'seed' ? 0.8 : currentPhase === 'growth' ? 0.7 : 0.6, 
            ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
          }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ 
              duration: currentPhase === 'seed' ? 0.7 : currentPhase === 'growth' ? 0.6 : 0.5, 
              ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
            }}
            className="relative w-3 h-[1px] flex items-center justify-center"
          >
            <span className={`absolute h-[1px] w-3 ${styles.iconColor} transition-colors duration-400 ${isOpen ? 'bg-white' : ''}`} />
            <span
              className={`absolute h-[1px] w-3 ${styles.iconColor} transition-colors duration-400 ${isOpen ? 'bg-white' : ''}`}
              style={{ transform: 'rotate(90deg)' }}
            />
          </motion.div>
        </motion.button>

        {/* Orbital Menu */}
        <motion.div
          className="fixed bottom-12 left-32 transform origin-left"
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            x: -20,
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
          animate={isOpen ? {
            opacity: 1,
            scale: 1,
            x: 0,
            visibility: 'visible',
            pointerEvents: 'auto'
          } : {
            opacity: 0,
            scale: 0.8,
            x: -20,
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
          transition={{ 
            duration: currentPhase === 'seed' ? 0.8 : currentPhase === 'growth' ? 0.7 : 0.6, 
            ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
          }}
        >
          <div className="flex flex-col items-start">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`font-mono font-light text-sm py-1.5 my-1 bg-transparent border-none cursor-pointer transition-all duration-400 tracking-wider
                  ${activeCanvas === item.id 
                    ? `${styles.activeTextColor} font-medium tracking-wider ${styles.activeTextShadow}` 
                    : currentPhase === 'seed' 
                      ? 'text-seed-text hover:text-white hover:translate-x-1'
                      : currentPhase === 'growth'
                        ? 'text-growth-text hover:text-white hover:translate-x-1'
                        : 'text-bloom-text hover:text-white hover:translate-x-1'
                  }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: isOpen ? 0.1 + (index * 0.05) : 0,
                  ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  x: 5,
                  letterSpacing: '0.12em',
                  transition: { duration: 0.4 }
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CuratorLensNav;
