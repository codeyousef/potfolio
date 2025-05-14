'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'The Aesthetics of Algorithmic Art',
    date: 'October 26, 2023',
    category: 'Digital Art',
    excerpt: 'Exploring the intersection of code and creativity, and how algorithms are shaping new forms of artistic expression.'
  },
  {
    id: '2',
    title: 'Designing for Emergence: Principles & Practice',
    date: 'September 15, 2023',
    category: 'Design Philosophy',
    excerpt: 'A deep dive into designing systems that allow for unexpected, emergent behaviors and delightful user experiences.'
  },
  {
    id: '3',
    title: 'The Future of Web: Interactive Narratives',
    date: 'August 02, 2023',
    category: 'Web Technology',
    excerpt: 'How interactive storytelling and advanced web technologies are converging to create richer, more engaging online journeys.'
  },
];

const JournalCanvas: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: -30 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8, 
        ease: [0.6, -0.05, 0.01, 0.99], 
        delay: 0.3,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.5 }, 
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.7, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto"
    >
      <motion.h1
        className="font-montserrat font-medium text-5xl md:text-7xl lg:text-8xl text-secondary-accent leading-tight tracking-tight mb-4 md:mb-6"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Field Notes.
      </motion.h1>
      <motion.p
        className="mb-12 md:mb-16 font-inter text-lg md:text-xl text-brand-off-white/70 max-w-lg"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        Insights, articles, and reflections from the digital frontier.
      </motion.p>

      <motion.div
        className="w-full max-w-3xl space-y-10 md:space-y-12"
        variants={listVariants}
        initial="hidden" 
        animate="visible"
      >
        {mockJournalEntries.map((entry) => (
          <motion.div 
            key={entry.id} 
            className="flex flex-col items-start text-left p-6 md:p-8 bg-brand-dark-gray/40 rounded-lg shadow-custom-subtle border border-brand-off-white/10 hover:bg-brand-dark-gray/60 hover:border-primary-accent/20 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="mb-2">
              <span className="font-inter text-xs text-primary-accent uppercase tracking-wider font-medium">{entry.category}</span>
            </div>
            <h3 className="font-montserrat font-semibold text-xl md:text-2xl lg:text-3xl text-brand-off-white mb-2">
              {entry.title}
            </h3>
            <p className="font-inter text-xs text-brand-off-white/60 mb-4">
              {entry.date}
            </p>
            <p className="font-inter text-sm md:text-base text-brand-off-white/80 leading-relaxed mb-5">
              {entry.excerpt}
            </p>
            <motion.button
              className="font-inter text-sm font-medium text-primary-accent hover:text-brand-off-white border border-primary-accent hover:border-brand-off-white py-2 px-5 rounded-md transition-colors duration-300 self-start"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} // primary-accent with low opacity
              whileTap={{ scale: 0.95 }}
            >
              Read Article
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default JournalCanvas;
