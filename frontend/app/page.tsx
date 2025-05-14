'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';

const overtureVariants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95, // Slightly shrink
    y: 20, // Move down a bit
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const siteShellVariants = {
  initial: {
    opacity: 0,
    scale: 1.05, // Start slightly larger
    y: -20, // Start slightly above
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.3 }, // Delay to allow Overture to exit
  },
  // No explicit exit for SiteShell here, as it's the main persistent view
};

export default function HomePage() {
  const [showOverture, setShowOverture] = useState(true);

  useEffect(() => {
    // Verify React is initializing
    console.log('HomePage mounted, showOverture:', showOverture);
    
    // Option to automatically skip Overture for faster testing
    // Uncomment this to bypass Overture during testing
    // setTimeout(() => setShowOverture(false), 1000);
  }, []);

  const handleBeginExperience = () => {
    console.log('Begin experience clicked');
    setShowOverture(false);
  };

  return (
    // Ensure the main container allows for absolute positioning of children if needed
    <main className="min-h-screen bg-brand-dark-gray relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showOverture ? (
          <motion.div
            key="overture-wrapper"
            variants={overtureVariants}
            initial="initial" // Overture starts visible and normal
            exit="exit"
            className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] select-none" 
          >
            <Overture onBegin={handleBeginExperience} />
          </motion.div>
        ) : (
          <motion.div
            key="siteshell-wrapper"
            variants={siteShellVariants}
            initial="initial"
            animate="animate"
            className="w-full h-full absolute inset-0" // Ensure it covers the area
          >
            <SiteShell />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
