'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HomeCanvas: React.FC = () => {
  const statementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96], // Smooth easing
        delay: 0.5, // Delay for appearance after SiteShell transition
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full text-center p-8"
      // This component will be displayed within SiteShell, which already has its own entry animation.
      // This animation is for the content of the HomeCanvas itself.
    >
      <motion.h1
        className="font-montserrat font-light text-5xl md:text-7xl lg:text-8xl text-white leading-tight tracking-tight"
        variants={statementVariants}
        initial="hidden"
        animate="visible"
      >
        Intangible Structures.
      </motion.h1>
      {/* Optional: A subtle sub-text or visual element could be added later for dawning clarity */}
    </motion.div>
  );
};

export default HomeCanvas;
