'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HomeCanvas: React.FC = () => {
  const statement = "Intangible Structures.";
  const characters = Array.from(statement);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5, // Delay for appearance after SiteShell transition
        when: "beforeChildren", // Ensure container animates before children
        staggerChildren: 0.06, // Time between each character animation
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8, // Duration for each character to animate
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full text-center p-8"
      // Overall canvas transition is handled by SiteShell, this is for content within HomeCanvas
    >
      <motion.h1
        className="font-montserrat font-light text-5xl md:text-7xl lg:text-8xl text-brand-off-white leading-tight tracking-tight flex flex-wrap justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={statement} // For accessibility
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={characterVariants}
            className={char === ' ' ? 'mx-1 md:mx-2' : ''} // Add space for space character
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      {/* Optional: A subtle sub-text or visual element could be added later for dawning clarity */}
    </motion.div>
  );
};

export default HomeCanvas;
