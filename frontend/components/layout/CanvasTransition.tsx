'use client';

import React, { ReactNode } from 'react';
import { motion, Variants, Transition } from 'framer-motion';

interface CanvasTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  phase?: 'seed' | 'growth' | 'bloom';
  delay?: number;
}

/**
 * CanvasTransition component implementing the "Kinetic Canvases" concept
 * from the Aethelframe Protocol design spec.
 * 
 * Different phases (seed/veil, growth/unfurling, bloom/horizon) affect the
 * animation properties to convey the "Emergence" narrative.
 */
const CanvasTransition: React.FC<CanvasTransitionProps> = ({ 
  children, 
  isVisible, 
  phase = 'bloom',
  delay = 0
}) => {
  // Animation properties vary based on the emergence phase
  const getVariants = () => {
    // Base animation for all phases
    const baseVariants = {
      hidden: {
        opacity: 0,
        rotateY: -5,
        scale: 0.95,
        perspective: 1000,
        transformStyle: "preserve-3d" as const,
      },
      visible: {
        opacity: 1,
        rotateY: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 90,
          damping: 20,
          delay
        } as Transition
      },
      exit: {
        opacity: 0,
        perspective: 1000,
        rotateY: 5,
        scale: 0.98,
        transition: {
          ease: "easeInOut",
          duration: 0.3
        } as Transition
      }
    } as Variants;

    // Adjust animation based on emergence phase
    switch (phase) {
      case 'seed':
        // Slower, more subdued entrance for the "seed/veil" phase
        return {
          ...baseVariants,
          hidden: {
            ...baseVariants.hidden,
            opacity: 0,
            scale: 0.9,
          },
          visible: {
            ...baseVariants.visible,
            transition: {
              type: "spring",
              stiffness: 90,
              damping: 20,
              duration: 0.9,
              delay: delay + 0.2
            } as Transition
          }
        } as Variants;
      case 'growth':
        // More dynamic, expansive motion for the "growth/unfurling" phase
        return {
          ...baseVariants,
          hidden: {
            ...baseVariants.hidden,
            scale: 0.85,
          },
          visible: {
            ...baseVariants.visible,
            transition: {
              type: "spring",
              stiffness: 95,
              damping: 18,
              delay
            } as Transition
          }
        } as Variants;
      default:
        // Confident, smooth animations for the "bloom/horizon" phase
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay
            } as Transition
          }
        } as Variants;
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default CanvasTransition;
