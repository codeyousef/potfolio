'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuratorLensNav from '../navigation/CuratorLensNav';
import { CanvasProvider, useCanvas } from '../../context/CanvasContext';
import HomeCanvas from '../canvases/HomeCanvas';
import PortfolioCanvas from '../canvases/PortfolioCanvas';
import ServicesCanvas from '../canvases/ServicesCanvas';
import JournalCanvas from '../canvases/JournalCanvas';
import ContactCanvas from '../canvases/ContactCanvas';
import ParticleBackground from '../ParticleBackground';

const canvasTransitionVariants = {
  initial: {
    opacity: 0,
    rotateY: 50, 
    scale: 0.9,
    // z: -150, // Original z value, adjust if needed with overture
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    // z: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    rotateY: -50,
    scale: 0.9,
    // z: -150,
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const SiteContent: React.FC = () => {
  const { activeCanvas } = useCanvas();

  const canvasWrapperStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
  } as React.CSSProperties;

  return (
    <>
      <ParticleBackground /> 
      <AnimatePresence mode="wait">
        {activeCanvas === 'home' && (
          <motion.div
            key="home-canvas"
            className="w-full h-full relative"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <HomeCanvas />
          </motion.div>
        )}
        
        {activeCanvas === 'portfolio' && (
          <motion.div
            key="portfolio-canvas"
            className="w-full h-full relative"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PortfolioCanvas />
          </motion.div>
        )}
        
        {activeCanvas === 'services' && (
          <motion.div
            key="services-canvas"
            className="w-full h-full relative"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ServicesCanvas />
          </motion.div>
        )}
        
        {activeCanvas === 'journal' && (
          <motion.div
            key="journal-canvas"
            className="w-full h-full relative"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <JournalCanvas />
          </motion.div>
        )}
        
        {activeCanvas === 'contact' && (
          <motion.div
            key="contact-canvas"
            className="w-full h-full relative"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ContactCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      <CuratorLensNav />
    </>
  );
};

const SiteShell: React.FC = () => {
  return (
    <CanvasProvider>
      <div 
        className="fixed inset-0 bg-brand-bg text-brand-text w-full h-full relative"
        style={{ overflow: 'hidden' }} 
      >
        <SiteContent />
      </div>
    </CanvasProvider>
  );
};

export default SiteShell;