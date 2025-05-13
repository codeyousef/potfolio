'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvas, CanvasId } from '../../context/CanvasContext';

interface NavItem {
  id: CanvasId;
  label: string;
}

const CuratorLensNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveCanvas } = useCanvas();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'atelier', label: 'Atelier' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavItemClick = (canvasId: CanvasId) => {
    setActiveCanvas(canvasId);
    console.log(`Attempting to navigate to ${canvasId}`);
    setIsOpen(false);
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 },
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="mb-4 p-4 bg-background/80 backdrop-blur-md rounded-md shadow-2xl border border-text/10"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ul className="space-y-3">
              {navItems.map((item) => (
                <motion.li key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => handleNavItemClick(item.id)}
                    className="font-inter text-lg text-text hover:text-highlight transition-colors duration-200 w-full text-left"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMenu}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-highlight shadow-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
        aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-8 h-8"
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.span
            className="absolute left-1/2 top-1/2 w-full h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2"
            style={{ y: '-0.5px' }}
          />
          <motion.span
            className="absolute left-1/2 top-1/2 w-full h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 rotate-90"
            style={{ y: '-0.5px' }}
          />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default CuratorLensNav;
