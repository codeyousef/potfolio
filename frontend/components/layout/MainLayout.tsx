'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';
import Navigation from '../navigation/Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component that provides the base structure for all pages
 * Implements the Aethelframe Protocol's design specifications and adapts to the current Emergence phase
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentPhase } = useEmergence();

  // Phase-specific styling
  const getPhaseStyles = () => {
    switch(currentPhase) {
      case 'seed':
        return {
          background: "bg-seed-bg",
          text: "text-seed-text",
          border: "border-neutral-800",
          footer: {
            heading: "text-seed-accent/80",
            link: "text-seed-text/60 hover:text-seed-accent transition-colors",
            copyright: "text-seed-text/40"
          }
        };
      case 'growth':
        return {
          background: "bg-growth-bg",
          text: "text-growth-text",
          border: "border-neutral-800",
          footer: {
            heading: "text-growth-accent/80",
            link: "text-growth-text/60 hover:text-growth-accent transition-colors",
            copyright: "text-growth-text/40"
          }
        };
      case 'bloom':
        return {
          background: "bg-bloom-bg",
          text: "text-bloom-text",
          border: "border-neutral-800",
          footer: {
            heading: "text-bloom-accent/80",
            link: "text-bloom-text/60 hover:text-bloom-accent transition-colors",
            copyright: "text-bloom-text/40"
          }
        };
      default:
        return {
          background: "bg-black",
          text: "text-white",
          border: "border-gray-800",
          footer: {
            heading: "text-gray-400",
            link: "text-gray-400 hover:text-white transition-colors",
            copyright: "text-gray-500"
          }
        };
    }
  };

  const styles = getPhaseStyles();

  // Animation variants based on the current phase
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: currentPhase === 'bloom' ? 0.7 : 1.0,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.5,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className={`min-h-screen ${styles.background} ${styles.text}`}>
      <Navigation />
      
      {/* Main content area */}
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="pt-16 px-4 md:px-8 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <footer className={`mt-20 py-10 px-4 border-t ${styles.border}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className={`font-heading text-sm tracking-widest uppercase ${styles.footer.heading}`}>
              Aethelframe
              <span className="ml-2 opacity-70">
                {currentPhase === 'seed' ? '▪︎' : currentPhase === 'growth' ? '▫︎' : '◇'}
              </span>
            </h3>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.footer.link}>
              Instagram
            </a>
            <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className={styles.footer.link}>
              Dribbble
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.footer.link}>
              LinkedIn
            </a>
          </div>
          
          <div className={`mt-4 md:mt-0 text-xs ${styles.footer.copyright}`}>
            {new Date().getFullYear()} Aethelframe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
