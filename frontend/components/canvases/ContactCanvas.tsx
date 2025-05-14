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
  { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile', icon: '🔗' }, // TODO: Replace with actual LinkedIn profile URL
  { id: 'github', name: 'GitHub', href: 'https://github.com/yourprofile', icon: '🐙' }, // TODO: Replace with actual GitHub profile URL
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
        delay: 0.3,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.6 },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto select-none"
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
        className="mb-10 md:mb-12 font-inter text-lg md:text-xl text-brand-off-white/80 max-w-md"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        Let's discuss your next project or explore how we can collaborate.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row sm:space-x-6 items-center space-y-6 sm:space-y-0"
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
            className="font-inter text-base font-medium text-primary-accent hover:text-brand-pure-white border border-primary-accent hover:bg-primary-accent/90 py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2.5 group min-w-[150px] justify-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {link.icon && <span className="text-xl group-hover:scale-110 transition-transform duration-300">{link.icon}</span>}
            <span>{link.name}</span>
          </motion.a>
        ))}
      </motion.div>

      <motion.p 
        className='mt-16 md:mt-20 font-inter text-sm text-brand-off-white/60'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 1.2 } }}
      >
        Looking forward to hearing from you.
      </motion.p>
    </motion.div>
  );
};

export default ContactCanvas;
