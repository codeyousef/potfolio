'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

interface ContactLink {
  id: string;
  name: string;
  href: string;
  icon?: string; // Simple text icon
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactLinks: ContactLink[] = [
  { id: 'email', name: 'Email', href: 'mailto:hello@aethelframe.com', icon: '✉️' },
  { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile', icon: '🔗' }, // TODO: Replace with actual LinkedIn profile URL
  { id: 'github', name: 'GitHub', href: 'https://github.com/yourprofile', icon: '🐙' }, // TODO: Replace with actual GitHub profile URL
];

const ContactCanvas: React.FC = () => {
  const { currentPhase } = useEmergence();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, you would send this data to your backend
    // For demonstration, we'll simulate a submission process
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }, 1500);
  };

  // Phase-specific styling
  const getPhaseStyles = () => {
    // Base classes
    const baseTitleClass = "font-heading font-bold text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-6 md:mb-8";
    const baseButtonClass = "py-3 px-6 rounded-sm font-mono text-sm transition-all duration-300";
    const baseInputClass = "font-mono bg-black/20 border px-4 py-3 rounded-sm text-sm w-full focus:outline-none";
    
    switch(currentPhase) {
      case 'seed':
        return {
          container: "bg-seed-bg",
          title: `${baseTitleClass} text-seed-accent`,
          subtitle: "text-seed-text/80",
          button: `${baseButtonClass} border border-seed-accent text-seed-accent hover:bg-seed-accent/10`,
          link: "border border-seed-accent text-seed-accent hover:bg-seed-accent/10",
          input: `${baseInputClass} border-neutral-800 focus:border-seed-accent/70 text-seed-text`,
          text: "text-seed-text"
        };
      case 'growth':
        return {
          container: "bg-growth-bg",
          title: `${baseTitleClass} text-growth-accent`,
          subtitle: "text-growth-text/80",
          button: `${baseButtonClass} border border-growth-accent text-growth-accent hover:bg-growth-accent/10`,
          link: "border border-growth-accent text-growth-accent hover:bg-growth-accent/10",
          input: `${baseInputClass} border-neutral-800 focus:border-growth-accent/70 text-growth-text`,
          text: "text-growth-text"
        };
      case 'bloom':
        return {
          container: "bg-bloom-bg",
          title: `${baseTitleClass} text-bloom-accent`,
          subtitle: "text-bloom-text/80",
          button: `${baseButtonClass} border border-bloom-accent text-bloom-accent hover:bg-bloom-accent/10`,
          link: "border border-bloom-accent text-bloom-accent hover:bg-bloom-accent/10",
          input: `${baseInputClass} border-neutral-800 focus:border-bloom-accent/70 text-bloom-text`,
          text: "text-bloom-text"
        };
      default:
        return {
          container: "bg-black",
          title: baseTitleClass,
          subtitle: "text-gray-300/80",
          button: baseButtonClass,
          link: "border border-gray-700 text-gray-200 hover:bg-gray-800",
          input: `${baseInputClass} border-gray-800 focus:border-gray-600`,
          text: "text-gray-300"
        };
    }
  };

  const styles = getPhaseStyles();

  // Phase-specific animation variants
  const titleVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: currentPhase === 'bloom' ? 0.7 : 1.0,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
        delay: 0.3,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: currentPhase === 'bloom' ? 0.6 : 0.8, 
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
        delay: 0.6 
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
        delay: 0.8 
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: currentPhase === 'seed' ? 0.25 : currentPhase === 'growth' ? 0.2 : 0.15,
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
      transition: { 
        duration: currentPhase === 'bloom' ? 0.6 : 0.7, 
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1] 
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-screen w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto ${styles.container}`}
    >
      <motion.h1
        className={styles.title}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        {currentPhase === 'seed' ? 'Contact' : currentPhase === 'growth' ? 'Connect' : 'Collaborate'}
      </motion.h1>
      
      <motion.p
        className={`mb-10 md:mb-12 font-mono text-lg md:text-xl max-w-md ${styles.subtitle}`}
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        {currentPhase === 'seed' 
          ? "Reach out to discuss potential collaborations." 
          : currentPhase === 'growth' 
            ? "Let's discuss your next project or explore how we can collaborate."
            : "Transform ideas into reality through thoughtful collaboration."}
      </motion.p>

      {/* Contact Form */}
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form 
            onSubmit={handleSubmit}
            className="w-full max-w-md mb-12"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
          >
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className={styles.input}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                className={styles.input}
              />
            </div>
            <div className="mb-6">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                required
                rows={4}
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.button} w-full relative overflow-hidden`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            className="w-full max-w-md mb-12 p-6 border border-neutral-800 rounded-sm bg-black/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
          >
            <div className={`text-xl ${styles.text} mb-2`}>Message Sent!</div>
            <p className={`text-sm ${styles.subtitle}`}>Thank you for reaching out. I'll get back to you soon.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-8 h-px w-24 bg-neutral-800"></div>

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
            className={`${styles.link} py-3 px-6 rounded-sm transition-all duration-300 flex items-center space-x-2.5 group min-w-[150px] justify-center`}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03,
              transition: { 
                duration: 0.3,
                ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
              }
            }}
            whileTap={{ scale: 0.97 }}
          >
            {link.icon && <span className="text-xl group-hover:scale-110 transition-transform duration-300">{link.icon}</span>}
            <span>{link.name}</span>
          </motion.a>
        ))}
      </motion.div>

      <motion.p 
        className={`mt-16 md:mt-20 font-mono text-sm opacity-60 ${styles.text}`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.6, 
          transition: { 
            duration: 0.8, 
            delay: 1.2,
            ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
          } 
        }}
      >
        {currentPhase === 'seed' 
          ? "Awaiting your transmission." 
          : currentPhase === 'growth' 
            ? "Looking forward to hearing from you."
            : "Begin our conversation."}
      </motion.p>
    </motion.div>
  );
};

export default ContactCanvas;
