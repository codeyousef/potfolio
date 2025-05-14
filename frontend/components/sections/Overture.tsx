'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OvertureProps {
  onBegin: () => void;
}

const Overture: React.FC<OvertureProps> = ({ onBegin }) => {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);

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
    onBegin();
  };

  // Variants for animations
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 3, ease: 'easeInOut', delay: 0.5 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1, 
        ease: 'easeOut', 
        delay: 3.5 
      } 
    },
  };

  const skipButtonVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7, 
      transition: { 
        duration: 1, 
        ease: 'easeInOut' 
      } 
    },
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

  return (
    <>
      {/* Monolith Entry Visual Element - could be implemented as a subtle background or SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-1/3 h-2/3 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="overture-title" 
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        AETHELFRAME
      </motion.h1>

      {/* Begin Button */}
      <motion.button
        className="overture-begin-button" 
        onClick={handleBegin}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        [ BEGIN ]
      </motion.button>

      {/* Skip Button - only shows after delay and for returning visitors */}
      <AnimatePresence>
        {showSkipButton && (
          <motion.button
            className="overture-skip-button" 
            onClick={handleBegin}
            variants={skipButtonVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            SKIP OVERTURE
          </motion.button>
        )}
      </AnimatePresence>

      {/* Welcome Back Message - only for returning visitors */}
      {isReturningVisitor && (
        <motion.div
          className="overture-welcome-back" 
          variants={welcomeBackVariants}
          initial="hidden"
          animate="visible"
        >
          Welcome back
        </motion.div>
      )}
    </>
  );
};

export default Overture;