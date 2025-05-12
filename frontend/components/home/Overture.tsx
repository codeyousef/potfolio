'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * The Overture component implements the "Monolith Entry" concept from
 * the Aethelframe Protocol design spec, representing the "Seed/Veil" phase
 * of the Emergence theme.
 */
interface OvertureProps {
  onComplete: () => void;
}

const Overture: React.FC<OvertureProps> = ({ onComplete }) => {
  const [isBeginHovered, setIsBeginHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Animations for the title
  const titleVariants = {
    hidden: { opacity: 0, letterSpacing: "0.3em" },
    visible: {
      opacity: 0.9,
      letterSpacing: "0.5em",
      transition: {
        duration: 2.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  // Animations for the begin button
  const beginVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 2.8
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      borderColor: "rgba(80, 227, 194, 1)",
      color: "rgba(80, 227, 194, 1)",
      transition: {
        duration: 0.3
      }
    }
  };

  // Background fade animation
  const bgVariants = {
    hidden: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.5,
        delay: 0.2
      }
    }
  };

  const handleBegin = useCallback(() => {
    setIsExiting(true);
    // Delay navigation to allow exit animations to play
    setTimeout(() => {
      onComplete();
    }, 1500);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      variants={bgVariants}
      initial="hidden"
      animate={isExiting ? "exit" : "hidden"}
    >
      <div className="flex flex-col items-center justify-center space-y-16">
        <motion.h1
          className="font-montserrat font-extralight text-5xl sm:text-7xl text-gray-100 tracking-widest uppercase"
          variants={titleVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
        >
          AETHELFRAME
        </motion.h1>
        
        <motion.button
          className="font-['Roboto_Mono'] text-sm border border-gray-700 rounded-sm px-6 py-2 text-gray-400 cursor-pointer focus:outline-none"
          onMouseEnter={() => setIsBeginHovered(true)}
          onMouseLeave={() => setIsBeginHovered(false)}
          onClick={handleBegin}
          variants={beginVariants}
          initial="hidden"
          animate={isExiting ? "exit" : "visible"}
          whileHover="hover"
        >
          [ BEGIN ]
        </motion.button>
      </div>
      
      {/* Subtle digital dust/particle effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }} 
      />
    </motion.div>
  );
};

export default Overture;
