'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ServiceItem {
  id: string;
  icon: string; // Placeholder for icon, e.g., emoji or char
  title: string;
  description: string;
}

const mockServices: ServiceItem[] = [
  { id: '1', icon: '💡', title: 'Digital Strategy & Consultation', description: 'Crafting visionary roadmaps for digital transformation and impactful online presence.' },
  { id: '2', icon: '✨', title: 'Interactive Experiences & Art', description: 'Designing and developing immersive, engaging digital art and interactive installations.' },
  { id: '3', icon: '💻', title: 'Avant-Garde Web Development', description: 'Building cutting-edge websites and web applications with a focus on artistry and performance.' },
  { id: '4', icon: '👁️‍🗨️', title: 'Brand Narrative & Visual Identity', description: 'Defining and expressing unique brand stories through compelling visual systems and narrative design.' },
];

const ServicesCanvas: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.3,
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5, // Delay after title
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto"
    >
      <motion.h1
        className="font-montserrat font-medium text-5xl md:text-7xl lg:text-8xl text-secondary-accent leading-tight tracking-tight mb-12 md:mb-16"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Capabilities.
      </motion.h1>
      
      <motion.div
        className="w-full max-w-3xl space-y-10 md:space-y-12"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {mockServices.map((service) => (
          <motion.div 
            key={service.id} 
            className="flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <span className="text-4xl md:text-5xl mb-3 md:mb-4" role="img" aria-label={`${service.title} icon`}>{service.icon}</span>
            <h3 className="font-montserrat font-semibold text-2xl md:text-3xl text-white mb-2">
              {service.title}
            </h3>
            <p className="font-inter text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ServicesCanvas;
