'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuratorLensNav from '../navigation/CuratorLensNav';
import { CanvasProvider, useCanvas } from '../../context/CanvasContext';
import HomeCanvas from '../canvases/HomeCanvas';
import AtelierCanvas from '../canvases/AtelierCanvas';
import ServicesCanvas from '../canvases/ServicesCanvas';
import JournalCanvas from '../canvases/JournalCanvas';
import ContactCanvas from '../canvases/ContactCanvas';

const canvasTransitionVariants = {
  initial: {
    opacity: 0,
    rotateY: 50, // Start rotated
    scale: 0.9,
    z: -150,     // Pushed back slightly
    transformOrigin: 'center center',
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.8, // Deliberate transition time
      ease: [0.43, 0.13, 0.23, 0.96], // Smooth easing
    },
  },
  exit: {
    opacity: 0,
    rotateY: -50, // Rotate out in the opposite direction
    scale: 0.9,
    z: -150,
    transition: {
      duration: 0.7, // Slightly faster exit
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const SiteContent: React.FC = () => {
  const { activeCanvas } = useCanvas();

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background text-text pt-20 pb-32"
      style={{ perspective: '1200px' }} // Added perspective for 3D transitions
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
    >
      <AnimatePresence mode="wait">
        {activeCanvas === 'home' && (
          <motion.div
            key="home-canvas" // Essential for AnimatePresence
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full" // Wrapper to fill space
          >
            <HomeCanvas />
          </motion.div>
        )}
        {activeCanvas === 'atelier' && (
          <motion.div
            key="atelier-canvas"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <AtelierCanvas />
          </motion.div>
        )}
        {activeCanvas === 'services' && (
          <motion.div
            key="services-canvas"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <ServicesCanvas />
          </motion.div>
        )}
        {activeCanvas === 'journal' && (
          <motion.div
            key="journal-canvas"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <JournalCanvas />
          </motion.div>
        )}
        {activeCanvas === 'contact' && (
          <motion.div
            key="contact-canvas"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <ContactCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curator's Lens Navigator is fixed, so it's rendered here but positioned via its own CSS */}
      <CuratorLensNav />
    </motion.div>
  );
};

const SiteShell: React.FC = () => {
  return (
    <CanvasProvider>
      <SiteContent />
    </CanvasProvider>
  );
};

export default SiteShell;