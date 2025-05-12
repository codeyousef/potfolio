'use client';

import { useState, useEffect } from 'react';
import Overture from '../components/home/Overture';
import MainLayout from '../components/layout/MainLayout';
import CanvasTransition from '../components/layout/CanvasTransition';
import { motion } from 'framer-motion';

export default function Home() {
  const [showOverture, setShowOverture] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle the transition from Overture to main content
  useEffect(() => {
    if (!showOverture) {
      // Add a slight delay before showing main content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showOverture]);

  const handleOvertureComplete = () => {
    setShowOverture(false);
  };

  // If showing the overture, render just that
  if (showOverture) {
    return <Overture onComplete={handleOvertureComplete} />;
  }

  return (
    <MainLayout>
      <CanvasTransition isVisible={showContent} phase="bloom">
        <section className="mt-20 mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="font-montserrat font-light text-4xl md:text-6xl text-center tracking-wide mb-6"
          >
            Synthesizing Visions
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.2 }}
            className="font-light text-gray-300 text-center max-w-2xl mx-auto leading-relaxed"
          >
            A digital atelier where design, technology, and narrative converge. Explore a curated collection of projects that embody the Emergence aesthetic.
          </motion.p>
        </section>

        <section className="my-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative aspect-[21/9] max-h-[70vh] overflow-hidden rounded-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent z-10" />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent z-10"
              style={{ 
                backgroundImage: 'url("/grain-texture.png")',
                backgroundBlendMode: 'overlay',
                opacity: 0.15
              }}
            />
            
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 20, ease: "easeInOut" }}
              className="w-full h-full bg-gray-900"
              style={{
                backgroundImage: 'url("/hero-image.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="mb-8"
                >
                  <span className="font-['Roboto_Mono'] text-sm tracking-wider bg-black/70 px-4 py-2 rounded-sm backdrop-blur-sm">
                    THE AETHELFRAME PROTOCOL
                  </span>
                </motion.div>
                
                <motion.a
                  href="/portfolio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="inline-block font-montserrat font-light text-xl tracking-wider border border-white/20 backdrop-blur-sm bg-black/30 px-8 py-3 rounded-sm hover:bg-white/10 transition-colors duration-300"
                >
                  View Atelier
                </motion.a>
              </div>
            </div>
          </motion.div>
        </section>
      </CanvasTransition>
    </MainLayout>
  );
}
