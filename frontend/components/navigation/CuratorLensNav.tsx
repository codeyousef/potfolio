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
  const { activeCanvas, setActiveCanvas } = useCanvas(); // Get activeCanvas

  useEffect(() => {
    console.log('CuratorLensNav mounted, isOpen:', isOpen);
  }, [isOpen]);

  const navItems: NavItemDef[] = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' }, // Changed from 'atelier'
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
  ];

  // Add Contact to the main nav list if it's not meant to be separate from these items
  const allNavItems: NavItemDef[] = [
    ...navItems,
    { id: 'contact', label: 'Contact Us' } // Consistent with other CanvasIds, label can be adjusted
  ];

  // Animation variants for nav container
  const navContainerVariants = {
    hidden: {
      opacity: 0,
      x: 50,
      transition: {
        staggerChildren: 0.05, // Stagger children when hiding
        staggerDirection: -1,  // Reverse the stagger
        when: 'afterChildren', // Hide parent after children
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.08, // Stagger children when showing
        when: 'beforeChildren', // Show parent before children
      },
    },
  };

  // Animation variants for individual nav items
  const navItemVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Handle navigation when a menu item is clicked
  const handleNavigation = (canvasId: CanvasId) => {
    setActiveCanvas(canvasId);
    setIsOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100]" style={{ opacity: 1, transform: 'none', zIndex: 100 }}> {/* Ensure high z-index */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="mb-3 p-3 bg-brand-dark-gray/80 backdrop-blur-lg rounded-lg shadow-2xl border border-brand-off-white/10 w-48"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={isOpen ? { opacity: 1, transform: 'none', zIndex: 90 } : undefined}
          >
            <ul className="space-y-1.5">
              {allNavItems.map((item) => (
                <motion.li key={item.id} variants={navItemVariants}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`font-roboto-mono w-full text-left py-2 px-3 rounded-md transition-all duration-200 ease-in-out 
                               ${activeCanvas === item.id 
                                 ? 'bg-primary-accent/20 text-primary-accent font-medium' 
                                 : 'text-brand-off-white/80 hover:bg-brand-off-white/10 hover:text-brand-off-white'}`}
                  >
                    <span className="flex items-center">
                      {activeCanvas === item.id && (
                        <motion.div 
                          layoutId="activeNavIndicator"
                          className="w-1.5 h-1.5 bg-primary-accent rounded-full mr-2.5"
                        />
                      )}
                      {item.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMenu}
        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 rounded-full bg-blue-500 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center focus:outline-none shadow-lg shadow-blue-500/30"
        aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          opacity: 1,
          transform: 'none',
          zIndex: 1000, // Extremely high z-index to ensure visibility
          position: 'fixed',
          bottom: '3rem', // 12px
          right: '3rem', // 12px
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
        }}
      >
        {/* Icon structure: two spans forming a '+' that rotates to 'X' */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative' }}
        >
          <span className="block absolute h-1 w-8 bg-white" />
          <span
            className="block absolute h-1 w-8 bg-white"
            style={{ transform: 'rotate(90deg)' }}
          />
          <span className="sr-only">Menu</span>
        </motion.div>
        
        {/* Text indicator */}
        <span 
          style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            fontWeight: 500
          }}
        >
          {isOpen ? 'Close Menu' : 'Menu'}
        </span>
      </motion.button>
    </div>
  );
};

export default CuratorLensNav;
