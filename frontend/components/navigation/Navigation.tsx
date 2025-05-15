'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
];

const Navigation: React.FC = () => {
  const { currentPhase, progressPhase } = useEmergence();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Style classes based on the current phase
  const getStyles = () => {
    const baseNavClass = "fixed top-0 left-0 w-full z-50 transition-all duration-500";
    const baseLogoClass = "font-heading tracking-wider text-sm md:text-base";
    const baseLinkClass = "font-mono text-xs md:text-sm transition-all duration-300";
    
    switch (currentPhase) {
      case 'seed':
        return {
          nav: `${baseNavClass} ${scrolled ? 'py-3 bg-seed-bg/90 backdrop-blur-md' : 'py-5'}`,
          logo: `${baseLogoClass} text-seed-accent`,
          link: {
            normal: `${baseLinkClass} text-seed-text/80 hover:text-seed-accent`,
            active: `${baseLinkClass} text-seed-accent`,
          },
          mobileMenu: "bg-seed-bg/95 backdrop-blur-md",
          mobileButton: "border-seed-accent",
          mobileButtonInner: "bg-seed-accent"
        };
      case 'growth':
        return {
          nav: `${baseNavClass} ${scrolled ? 'py-3 bg-growth-bg/90 backdrop-blur-md' : 'py-5'}`,
          logo: `${baseLogoClass} text-growth-accent`,
          link: {
            normal: `${baseLinkClass} text-growth-text/80 hover:text-growth-accent`,
            active: `${baseLinkClass} text-growth-accent`,
          },
          mobileMenu: "bg-growth-bg/95 backdrop-blur-md",
          mobileButton: "border-growth-accent",
          mobileButtonInner: "bg-growth-accent"
        };
      case 'bloom':
        return {
          nav: `${baseNavClass} ${scrolled ? 'py-3 bg-bloom-bg/90 backdrop-blur-md' : 'py-5'}`,
          logo: `${baseLogoClass} text-bloom-accent`,
          link: {
            normal: `${baseLinkClass} text-bloom-text/80 hover:text-bloom-accent`,
            active: `${baseLinkClass} text-bloom-accent`,
          },
          mobileMenu: "bg-bloom-bg/95 backdrop-blur-md",
          mobileButton: "border-bloom-accent",
          mobileButtonInner: "bg-bloom-accent"
        };
      default:
        return {
          nav: `${baseNavClass} ${scrolled ? 'py-3 bg-black/90 backdrop-blur-md' : 'py-5'}`,
          logo: `${baseLogoClass} text-white`,
          link: {
            normal: `${baseLinkClass} text-gray-400 hover:text-white`,
            active: `${baseLinkClass} text-white`,
          },
          mobileMenu: "bg-black/95 backdrop-blur-md",
          mobileButton: "border-white",
          mobileButtonInner: "bg-white"
        };
    }
  };

  const styles = getStyles();

  // Animation variants
  const navVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const linkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: currentPhase === 'bloom' ? 'spring' : 'easeInOut',
        stiffness: 300,
        damping: 25
      } 
    },
    exit: { 
      opacity: 0, 
      x: '100%', 
      transition: { 
        duration: 0.3, 
        ease: 'easeInOut' 
      } 
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to handle phase advancement (only shown in mobile menu for simplified UI)
  const handlePhaseChange = () => {
    progressPhase();
    setIsMobileMenuOpen(false);
  };

  // Easter egg-like phase indicator
  const getPhaseEmoji = () => {
    switch (currentPhase) {
      case 'seed': return '▪︎'; // Seed
      case 'growth': return '▫︎'; // Growth
      case 'bloom': return '◇'; // Bloom
      default: return '•'; 
    }
  };

  return (
    <>
      <motion.nav 
        className={styles.nav}
        initial="initial"
        animate="animate"
        variants={navVariants}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className={styles.logo}>
            AETHELFRAME
            <span className="ml-2 opacity-70">{getPhaseEmoji()}</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <motion.div 
                key={link.name}
                variants={linkVariants}
                custom={index}
                initial="initial"
                animate="animate"
              >
                <Link
                  href={link.href}
                  className={pathname === link.href ? styles.link.active : styles.link.normal}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button 
            className={`md:hidden w-6 h-6 flex flex-col justify-around z-50 focus:outline-none relative ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span 
              className={`w-6 h-px transform transition-all duration-300 ${styles.mobileButtonInner} ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <span 
              className={`w-6 h-px transition-all duration-300 ${styles.mobileButtonInner} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span 
              className={`w-6 h-px transform transition-all duration-300 ${styles.mobileButtonInner} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={`fixed inset-0 ${styles.mobileMenu} z-40 flex flex-col justify-center items-center`}
            initial="closed"
            animate="open"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col items-center space-y-8 py-20">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-lg ${pathname === link.href ? styles.link.active : styles.link.normal}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-8 pt-8 border-t border-neutral-800 w-16 flex justify-center">
                <button 
                  onClick={handlePhaseChange}
                  className={`mt-4 px-4 py-2 text-xs rounded-sm border ${styles.mobileButton} ${styles.link.normal}`}
                >
                  Emergence: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
