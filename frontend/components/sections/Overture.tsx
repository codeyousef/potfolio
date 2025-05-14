'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface OvertureProps {
  onBegin: () => void; // Callback to signal the beginning of the main experience
}

const Overture: React.FC<OvertureProps> = ({ onBegin }) => {
  useEffect(() => {
    console.log('Overture component mounted');
  }, []);
  
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 3,
        ease: 'easeInOut',
        delay: 0.5,
      },
    },
  };

  const promptVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: [1, 1.03, 1], // Subtle pulse
      transition: {
        delay: 2, // Delay until title is somewhat visible
        opacity: { duration: 1.5, ease: 'easeInOut' },
        y: { duration: 1.5, ease: 'easeInOut' },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3.5, // Start pulsing a bit after appearing
        },
      },
    },
    hover: {
      scale: 1.1,
      textShadow: '0 0 15px #3b82f6', // Use primary-accent blue for glow
      color: '#ffffff', // Use brand-pure-white for text on hover
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const skipButtonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 4, // Appears after 4 seconds
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen w-screen bg-brand-dark-gray select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }} // Stays visible until onBegin is called
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }} // For transitioning out
      // Fallback inline styles to ensure visibility even if animations don't run
      style={{ opacity: 1 }}
    >
      <motion.h1
        className="font-montserrat text-6xl md:text-8xl lg:text-9xl font-light text-brand-off-white tracking-[0.2em] md:tracking-[0.3em] uppercase"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        // Fallback inline styles to ensure visibility even if animations don't run
        style={{ opacity: 1 }}
      >
        Aethelframe
      </motion.h1>
      <motion.button
        className="mt-12 font-roboto-mono text-sm text-brand-off-white tracking-wider py-2 px-4 border border-transparent focus:outline-none"
        variants={promptVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={onBegin}
        // Fallback inline styles to ensure visibility even if animations don't run
        style={{ opacity: 1, transform: 'none' }}
      >
        [ BEGIN ]
      </motion.button>

      <motion.button
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 font-roboto-mono text-xs text-brand-off-white/70 hover:text-brand-off-white focus:outline-none transition-colors duration-300"
        variants={skipButtonVariants}
        initial="hidden"
        animate="visible"
        onClick={onBegin} // Also triggers onBegin
        // Fallback inline styles to ensure visibility even if animations don't run
        style={{ opacity: 0.7, transform: 'none' }}
      >
        Skip Overture
      </motion.button>
    </motion.div>
  );
};

export default Overture;