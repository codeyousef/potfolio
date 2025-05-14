'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas, CanvasId } from '../../context/CanvasContext';

interface NavItemDef {
  id: CanvasId;
  label: string;
}

const CuratorLensNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeCanvas, setActiveCanvas } = useCanvas();

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

  // Animation variants for nav container
  const navContainerVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.08,
        when: 'beforeChildren',
      },
    },
  };

  // Animation variants for individual nav items
  const navItemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Position indicator - shows current location in the experience */}
      <motion.div 
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black py-3 px-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="font-montserrat text-white">
          {activeCanvas.charAt(0).toUpperCase() + activeCanvas.slice(1)}
        </span>
      </motion.div>

      {/* Orbital Navigator (bottom left) */}
      <div className="fixed bottom-12 left-12 z-[100]">
        <motion.button
          onClick={toggleMenu}
          className={`w-9 h-9 bg-transparent border border-white/10 rounded-full flex items-center justify-center focus:outline-none shadow-lg transition-all duration-700 ${isOpen ? 'border-[#50E3C2]' : ''}`}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          whileHover={{ 
            scale: 1.2, 
            rotate: -15,
            borderColor: '#50E3C2' 
          }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
            className="relative w-3 h-[1px] flex items-center justify-center"
          >
            <span className={`absolute h-[1px] w-3 bg-[#0073E6] shadow-[0_0_5px_#0073E6] transition-colors duration-400 ${isOpen ? 'bg-white' : ''}`} />
            <span
              className={`absolute h-[1px] w-3 bg-[#0073E6] shadow-[0_0_5px_#0073E6] transition-colors duration-400 ${isOpen ? 'bg-white' : ''}`}
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
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div className="flex flex-col items-start">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`font-montserrat font-light text-sm py-1.5 my-1 bg-transparent border-none cursor-pointer transition-all duration-400 tracking-wider
                  ${activeCanvas === item.id 
                    ? 'text-[#0073E6] font-medium tracking-wider text-shadow-[0_0_8px_#0073E6]' 
                    : 'text-[#A0A0A0] hover:text-white hover:translate-x-1'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: isOpen ? 0.1 + (index * 0.05) : 0
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
