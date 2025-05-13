'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OvertureProps {
  onBegin: () => void; // Callback to signal the beginning of the main experience
}

const Overture: React.FC<OvertureProps> = ({ onBegin }) => {
  const [isHoveringBegin, setIsHoveringBegin] = useState(false);

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
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        delay: 2, // Delay until title is somewhat visible
      },
    },
    hover: {
      scale: 1.1,
      textShadow: '0 0 15px var(--secondary-accent)',
      color: 'var(--highlight-color)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen w-screen bg-background select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }} // Stays visible until onBegin is called
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }} // For transitioning out
    >
      <motion.h1
        className="font-montserrat text-6xl md:text-8xl lg:text-9xl font-extralight text-text tracking-[0.2em] md:tracking-[0.3em] uppercase"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Aethelframe
      </motion.h1>
      <motion.button
        className="mt-12 font-mono text-sm text-text tracking-wider py-2 px-4 border border-transparent focus:outline-none"
        variants={promptVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => setIsHoveringBegin(true)}
        onHoverEnd={() => setIsHoveringBegin(false)}
        onClick={onBegin}
      >
        [ BEGIN ]
      </motion.button>
    </motion.div>
  );
};

export default Overture;