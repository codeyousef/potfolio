'use client';

import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component that provides the base structure for all pages
 * Implements the Aethelframe Protocol's design specifications
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Main content area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 px-4 md:px-8 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <footer className="mt-20 py-10 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-montserrat text-sm tracking-widest uppercase text-gray-400">Aethelframe</h3>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Dribbble
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-gray-500">
            {new Date().getFullYear()} Aethelframe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
