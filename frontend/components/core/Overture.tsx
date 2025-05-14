'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OvertureProps {
  onEnter: () => void;
}

const Overture: React.FC<OvertureProps> = ({ onEnter }) => {
  const monolithEntryVariants = {
    initial: {
      opacity: 1,
      visibility: 'visible' as const,
    },
    exit: {
      opacity: 0,
      visibility: 'hidden' as const,
      transition: {
        duration: 1.5, // --transition-duration-slow
        ease: [0.83, 0, 0.17, 1], // --easing-curve-display
        when: 'afterChildren', // Ensures children animations (if any on exit) complete
      },
    },
  };

  const titleVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 0.7,
      y: 0,
      scale: 1,
      transition: {
        duration: 2, // --transition-duration-epic
        delay: 1,
        ease: [0.83, 0, 0.17, 1], // --easing-curve-display
      },
    },
  };

  const promptVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 0.5,
      transition: {
        duration: 2,
        delay: 2.5, // After title reveal
      },
    },
  };

  return (
    <motion.div
      id="monolith-entry"
      className="fixed inset-0 bg-black z-[200] flex flex-col justify-center items-center"
      variants={monolithEntryVariants}
      initial="initial"
      exit="exit" // This will be triggered by AnimatePresence in SiteShell
    >
      <motion.h1
        className="font-heading font-extralight text-4xl text-brand-pure-white tracking-[0.8em] uppercase mb-16"
        style={{ textShadow: '0 0 25px rgba(255,255,255,0.15)' }} // Corresponds to .monolith-title text-shadow
        variants={titleVariants}
        animate="animate"
      >
        AETHELFRAME
      </motion.h1>

      <motion.div
        id="monolith-prompt-interactive"
        className="font-mono text-secondary-accent text-xs tracking-[0.3em] cursor-pointer px-8 py-4 relative group"
        variants={promptVariants}
        animate="animate"
        onClick={onEnter}
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onEnter(); }}
        tabIndex={0}
        role="button"
        aria-label="Initiate Access Sequence"
      >
        [ BEGIN ]
        <span className="absolute top-1/2 left-1/2 w-0 h-px bg-secondary-accent opacity-50 transition-all duration-500 ease-interactive group-hover:w-[80%] group-hover:opacity-100 transform -translate-x-1/2 -translate-y-1/2"></span>
      </motion.div>

      <a
        href="#"
        className="absolute bottom-10 font-mono text-[#181818] text-[0.6rem] tracking-[0.1em] no-underline cursor-pointer transition-colors duration-400 hover:text-brand-text"
        onClick={(e) => {
          e.preventDefault();
          onEnter();
        }}
      >
        Enter Gallery
      </a>
    </motion.div>
  );
};

export default Overture;
