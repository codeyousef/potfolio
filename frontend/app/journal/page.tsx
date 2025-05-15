'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import JournalCanvas from '@/components/canvases/JournalCanvas';
import { useEmergence } from '@/context/EmergenceContext';

export default function JournalPage() {
  const { currentPhase } = useEmergence();
  
  // Phase-specific page transition animation
  const pageVariants = {
    initial: { 
      opacity: 0,
      y: currentPhase === 'bloom' ? 20 : 40
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: currentPhase === 'bloom' ? 0.7 : 1.0,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: currentPhase === 'bloom' ? -20 : -40,
      transition: { 
        duration: 0.5,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <MainLayout>
      <motion.div
        className="w-full"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <JournalCanvas />
      </motion.div>
    </MainLayout>
  );
}
