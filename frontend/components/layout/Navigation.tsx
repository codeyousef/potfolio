'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Atelier', path: '/portfolio' },
  { name: 'Services', path: '/services' },
  { name: 'Journal', path: '/journal' },
  { name: 'Contact', path: '/contact' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants for the "Curator's Lens" navigator
  const navButtonVariants = {
    hover: {
      scale: 1.05,
    },
  };

  // Animation variants for the menu items
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 0.6,
      },
    },
  };

  return (
    <>
      {/* The "Curator's Lens" navigator */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        variants={navButtonVariants}
        whileHover="hover"
      >
        <button
          onClick={toggleMenu}
          className="relative h-12 w-12 cursor-pointer focus:outline-none"
          aria-label="Navigation menu"
        >
          <div 
            className={`relative h-12 w-12 cursor-pointer before:content-[''] before:absolute before:h-[1px] before:w-6 before:bg-gray-400 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 ${isOpen ? 'before:rotate-45 before:bg-teal-400' : ''} after:content-[''] after:absolute after:h-6 after:w-[1px] after:bg-gray-400 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 ${isOpen ? 'after:rotate-45 after:bg-teal-400' : ''} hover:before:bg-teal-400 hover:after:bg-teal-400 transition-all duration-300`}
          />
        </button>
      </motion.div>

      {/* The menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-40 flex items-center justify-center"
          >
            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <ul className="space-y-8">
                {menuItems.map((item) => (
                  <motion.li key={item.name} variants={menuItemVariants}>
                    <Link 
                      href={item.path}
                      className="font-montserrat text-2xl tracking-wider text-gray-300 hover:text-white inline-block relative pb-1 group"
                      onClick={toggleMenu}
                    >
                      <span>{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-secondary group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
