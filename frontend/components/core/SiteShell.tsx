'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuratorLensNav from '../navigation/CuratorLensNav';
import { CanvasProvider, useCanvas } from '../../context/CanvasContext';
import { useEmergence } from '../../context/EmergenceContext';
import HomeCanvas from '../canvases/HomeCanvas';
import PortfolioCanvas from '../canvases/PortfolioCanvas';
import ServicesCanvas from '../canvases/ServicesCanvas';
import JournalCanvas from '../canvases/JournalCanvas';
import ContactCanvas from '../canvases/ContactCanvas';
import ParticleBackground from '../ParticleBackground';
import PositionIndicator from '../navigation/PositionIndicator';
import ContactBeacon from '../navigation/ContactBeacon';

// Define transition variants based on Emergence phase
const getTransitionVariants = (phase: string) => {
  // Base transitions shared by all phases
  const baseVariants = {
    initial: {
      opacity: 0,
      rotateY: phase === 'seed' ? 30 : phase === 'growth' ? 40 : 50, 
      scale: phase === 'seed' ? 0.95 : phase === 'growth' ? 0.92 : 0.9,
      z: phase === 'seed' ? -100 : phase === 'growth' ? -120 : -150,
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      z: 0,
      transition: {
        duration: phase === 'seed' ? 1.2 : phase === 'growth' ? 1 : 0.8,
        ease: phase === 'seed' 
          ? [0.16, 1, 0.3, 1] // Slower, more deliberate for seed phase
          : phase === 'growth' 
            ? [0.25, 0.1, 0.25, 1] // Middle ground for growth phase
            : [0.34, 1.56, 0.64, 1], // Bloom phase - more dynamic/bouncy
      },
    },
    exit: {
      opacity: 0,
      rotateY: phase === 'seed' ? -30 : phase === 'growth' ? -40 : -50,
      scale: phase === 'seed' ? 0.95 : phase === 'growth' ? 0.92 : 0.9,
      z: phase === 'seed' ? -100 : phase === 'growth' ? -120 : -150,
      transition: {
        duration: phase === 'seed' ? 1 : phase === 'growth' ? 0.85 : 0.7,
        ease: phase === 'seed' 
          ? [0.16, 1, 0.3, 1] 
          : phase === 'growth' 
            ? [0.25, 0.1, 0.25, 1] 
            : [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return baseVariants;
};

const SiteContent: React.FC = () => {
  const { activeCanvas } = useCanvas();
  const { currentPhase, isTransitioning } = useEmergence();
  
  // Get transition variants based on current emergence phase
  const canvasTransitionVariants = getTransitionVariants(currentPhase);

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

  // Value proposition text for Growth phase
  const renderValueProposition = () => {
    if (currentPhase === 'growth' && !isTransitioning) {
      return (
        <motion.div 
          className="fixed top-8 right-8 max-w-xs font-mono text-xs text-growth-text opacity-0"
          animate={{ opacity: 0.7, y: [10, 0] }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Emergence unfolds through design. Conscious creation through deliberate expression.
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full" style={canvasWrapperStyle}>
      <ParticleBackground phase={currentPhase} /> 
      
      {renderValueProposition()}
      
      <AnimatePresence mode="wait">
        {activeCanvas === 'home' && (
          <motion.div
            key="home-canvas"
            className="canvas"
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
            className="canvas"
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
            className="canvas"
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
            className="canvas"
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
            className="canvas"
            variants={canvasTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ContactCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      <PositionIndicator /> 
      <CuratorLensNav />
      <ContactBeacon />
    </div>
  );
};

const SiteShell: React.FC = () => {
  return (
    <CanvasProvider>
      <div 
        className="fixed inset-0 w-full h-full overflow-hidden"
      >
        <SiteContent />
      </div>
    </CanvasProvider>
  );
};

export default SiteShell;