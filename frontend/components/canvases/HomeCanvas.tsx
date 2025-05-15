'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

const HomeCanvas: React.FC = () => {
  const { currentPhase } = useEmergence();
  
  // Phase-based styling
  const getPhaseClasses = () => {
    const baseClasses = "flex flex-col justify-center items-center min-h-screen w-full p-6 relative";
    
    switch(currentPhase) {
      case 'seed':
        return `${baseClasses}`;
      case 'growth':
        return `${baseClasses}`;
      case 'bloom':
        return `${baseClasses}`;
      default:
        return baseClasses;
    }
  };
  
  // Animation variants
  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: currentPhase === 'seed' ? 1.2 : currentPhase === 'growth' ? 1 : 0.8,
        ease: currentPhase === 'bloom' 
          ? [0.34, 1.56, 0.64, 1] 
          : [0.16, 1, 0.3, 1], 
        delay: 0.2
      }
    }
  };
  
  const subtitleVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 0.8, 
      y: 0,
      transition: { 
        duration: currentPhase === 'seed' ? 1 : currentPhase === 'growth' ? 0.9 : 0.7,
        ease: currentPhase === 'bloom' 
          ? [0.34, 1.56, 0.64, 1] 
          : [0.16, 1, 0.3, 1], 
        delay: 0.4
      }
    }
  };
  
  const contentVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1,
        ease: currentPhase === 'bloom' 
          ? [0.34, 1.56, 0.64, 1] 
          : [0.16, 1, 0.3, 1], 
        delay: 0.6
      }
    }
  };

  // Phase-specific content
  const renderPhaseContent = () => {
    switch(currentPhase) {
      case 'seed':
        return (
          <motion.div 
            className="max-w-2xl text-center mt-8 font-mono text-sm leading-relaxed text-seed-text"
            variants={contentVariants}
          >
            <p>
              Welcome to the emergence protocol. This is the initial phase of your journey through the Aethelframe system.
              <br /><br />
              Navigate through the orbital lens to begin exploring the different landscapes.
            </p>
          </motion.div>
        );
      case 'growth':
        return (
          <motion.div 
            className="max-w-2xl text-center mt-8 font-mono text-sm leading-relaxed text-growth-text"
            variants={contentVariants}
          >
            <p>
              As growth unfurls, new pathways become accessible. The Aethelframe protocol adapts and enhances your experience.
              <br /><br />
              The system is calibrating to your presence. Explore the expanded dimensions now available.
            </p>
          </motion.div>
        );
      case 'bloom':
        return (
          <motion.div 
            className="max-w-2xl text-center mt-8 font-mono text-sm leading-relaxed text-bloom-text"
            variants={contentVariants}
          >
            <p>
              Full bloom achieved. The Aethelframe protocol is now operating at optimal capacity.
              <br /><br />
              All pathways are open. Navigate freely through the complete experience.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getPhaseClasses()}>
      {/* Decorative elements that change with phases */}
      <div className="absolute inset-0 pointer-events-none">
        {currentPhase === 'bloom' && (
          <motion.div 
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-5 bg-bloom-accent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
        )}
      </div>
      
      {/* Main content */}
      <motion.h1 
        className={`text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-light tracking-wide mb-4
          ${currentPhase === 'seed' 
            ? 'text-seed-accent' 
            : currentPhase === 'growth' 
              ? 'text-growth-accent' 
              : 'text-bloom-accent'}`}
        variants={titleVariants}
        initial="initial"
        animate="animate"
      >
        AETHELFRAME
      </motion.h1>
      
      <motion.h2 
        className="text-base md:text-lg font-mono tracking-wider mb-8 opacity-80"
        variants={subtitleVariants}
        initial="initial"
        animate="animate"
      >
        {currentPhase === 'seed' 
          ? 'SEED PHASE' 
          : currentPhase === 'growth' 
            ? 'GROWTH PHASE' 
            : 'BLOOM PHASE'}
      </motion.h2>
      
      {renderPhaseContent()}
      
      {/* Phase indicator */}
      <motion.div 
        className="absolute bottom-12 right-12 font-mono text-xs tracking-wider opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {currentPhase.toUpperCase()} /{' '}
        <span className={currentPhase === 'bloom' ? 'text-bloom-accent' : 'text-gray-400'}>
          EMERGENCE
        </span>
      </motion.div>
    </div>
  );
};

export default HomeCanvas;