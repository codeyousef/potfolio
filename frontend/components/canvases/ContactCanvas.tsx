'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ContactLink {
  id: string;
  name: string;
  href: string;
  icon?: string; // Simple text icon
}

const contactLinks: ContactLink[] = [
  { id: 'email', name: 'Email', href: 'mailto:hello@aethelframe.com', icon: '✉️' },
  { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile', icon: '🔗' }, // Replace with actual link
  { id: 'github', name: 'GitHub', href: 'https://github.com/yourprofile', icon: '🐙' }, // Replace with actual link
];

const ContactCanvas: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.0,
        ease: 'circOut',
        delay: 0.3, // Adjusted delay
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.6 }, // Delay after title
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8, // Delay after subtitle
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto"
    >
      <motion.h1
        className="font-montserrat font-bold text-5xl md:text-7xl lg:text-8xl text-secondary-accent leading-tight tracking-tight mb-6 md:mb-8"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Connect.
      </motion.h1>
      <motion.p
        className="mb-10 md:mb-12 font-inter text-lg md:text-xl text-text/80 max-w-md"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        Let's discuss your next project or explore how we can collaborate.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row sm:space-x-8 space-y-6 sm:space-y-0 items-center"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {contactLinks.map((link) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-lg text-primary-accent hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.icon && <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{link.icon}</span>}
            <span>{link.name}</span>
          </motion.a>
        ))}
      </motion.div>

      {/* Optional: A small note about response times or preferred contact method */}
      <motion.p 
        className='mt-12 md:mt-16 font-inter text-sm text-text/60'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 1.2 } }}
      >
        Looking forward to hearing from you.
      </motion.p>
    </motion.div>
  );
};

export default ContactCanvas;
