'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';
import EmergenceProvider from '../context/EmergenceContext';

const overtureVariants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95, // Slightly shrink
    y: 20, // Move down a bit
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Seed phase curve
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
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1], // Seed phase curve
      delay: 0.3 
    }, // Delay to allow Overture to exit
  },
  // No explicit exit for SiteShell here, as it's the main persistent view
};

export default function HomePage() {
  const [showOverture, setShowOverture] = useState(true);

  useEffect(() => {
    // Check for previously visited to potentially skip the overture
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    const shouldSkipOverture = hasVisitedBefore && new URL(window.location.href).searchParams.get('showOverture') !== 'true';
    
    if (shouldSkipOverture) {
      setShowOverture(false);
    }
    
    // Option to automatically skip Overture for faster testing
    // Uncomment this to bypass Overture during testing
    // setTimeout(() => setShowOverture(false), 1000);
  }, []);

  const handleBeginExperience = () => {
    setShowOverture(false);
  };

  return (
    <EmergenceProvider>
      {/* Ensure the main container allows for absolute positioning of children if needed */}
      <main className="min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showOverture ? (
            <motion.div
              key="overture-wrapper"
              variants={overtureVariants}
              initial="initial" // Overture starts visible and normal
              exit="exit"
              className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-seed-bg select-none" 
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
    </EmergenceProvider>
  );
}
