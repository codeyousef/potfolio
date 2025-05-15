'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

interface OvertureProps {
  onBegin: () => void;
}

const Overture: React.FC<OvertureProps> = ({ onBegin }) => {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const { progressPhase } = useEmergence();

  useEffect(() => {
    // Check if user is a returning visitor
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setIsReturningVisitor(true);
    }

    // Show skip button after 3 seconds delay
    const timer = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBegin = () => {
    // Set the flag in localStorage
    localStorage.setItem('hasVisitedBefore', 'true');
    // Progress the Emergence phase
    progressPhase();
    // Trigger the onBegin callback
    onBegin();
  };

  // Variants for animations
  const titleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 0.85, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 3, 
        ease: [0.16, 1, 0.3, 1], // Use the emergence curve
        delay: 0.5 
      } 
    },
  };

  const beginButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 0.7, 
      y: 0, 
      transition: { 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1], 
        delay: 3 
      } 
    },
    hover: { 
      opacity: 1, 
      scale: 1.05, 
      textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
      transition: { 
        duration: 0.3, 
        ease: [0.34, 1.56, 0.64, 1] // Bloom curve for hover
      } 
    },
    // Add pulse animation
    pulse: {
      scale: [1, 1.03, 1],
      opacity: [0.7, 0.9, 0.7],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const skipButtonVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.5, 
      transition: { 
        duration: 1, 
        ease: 'easeInOut' 
      } 
    },
    hover: {
      opacity: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const welcomeBackVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7, 
      transition: { 
        duration: 1, 
        ease: 'easeInOut',
        delay: 1
      } 
    },
  };

  // Monolith entry gradient animation
  const monolithVariants = {
    hidden: { opacity: 0, scaleY: 0.8 },
    visible: { 
      opacity: 0.05, 
      scaleY: 1,
      transition: { 
        duration: 2.5, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-seed-bg text-seed-text overflow-hidden z-50">
      {/* Monolith Entry Visual Element - a vertical beam/pillar/slit of light */}
      <motion.div
        variants={monolithVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-1/5 h-2/3 bg-gradient-to-b from-transparent via-seed-accent to-transparent opacity-20"></div>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.15em] text-white mb-16 relative z-10" 
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        AETHELFRAME
      </motion.h1>

      {/* Begin Button */}
      <motion.button
        className="font-mono text-sm md:text-base tracking-[0.2em] py-2 px-4 border border-transparent hover:border-seed-accent focus:border-seed-accent text-white relative focus:outline-none z-10" 
        onClick={handleBegin}
        variants={beginButtonVariants}
        initial="hidden"
        animate={["visible", "pulse"]}
        whileHover="hover"
        whileFocus="hover"
        aria-label="Begin the experience"
      >
        [ BEGIN ]
      </motion.button>

      {/* Skip Button - only shows after delay and for returning visitors */}
      <AnimatePresence>
        {showSkipButton && (
          <motion.button
            className="fixed bottom-10 font-mono text-xs tracking-wide text-seed-text hover:text-white focus:text-white focus:outline-none" 
            onClick={handleBegin}
            variants={skipButtonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileFocus="hover"
            exit={{ opacity: 0 }}
            aria-label="Skip introduction"
          >
            SKIP OVERTURE
          </motion.button>
        )}
      </AnimatePresence>

      {/* Welcome Back Message - only for returning visitors */}
      {isReturningVisitor && (
        <motion.div
          className="absolute top-10 font-mono text-xs tracking-wide text-seed-text" 
          variants={welcomeBackVariants}
          initial="hidden"
          animate="visible"
        >
          Welcome back
        </motion.div>
      )}
    </div>
  );
};

export default Overture;