'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamic import for 3D theme toggle
const ThemeToggle3D = dynamic(() => import('./ThemeToggle3D'), {
  ssr: false,
  loading: () => (
    <div className="w-12 h-12 bg-bg-card rounded-full animate-pulse" />
  ),
});

const menuItems = [
  { label: 'Work', href: '/work', offset: { x: 0, y: 0 } },
  { label: 'About', href: '/about', offset: { x: -10, y: 5 } },
  { label: 'Services', href: '/services', offset: { x: 5, y: -3 } },
  { label: 'Blog', href: '/blog', offset: { x: -5, y: 8 } },
  { label: 'Contact', href: '/contact', offset: { x: 0, y: 0 }, isAccent: true }
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  // Update theme
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navStyles = {
    initial: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      padding: '2rem 0',
      backdropFilter: 'blur(0px)',
    },
    scrolled: {
      backgroundColor: 'rgba(10, 10, 10, 0.8)',
      padding: '1rem 0',
      backdropFilter: 'blur(10px)',
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial="initial"
        animate={isScrolled ? 'scrolled' : 'initial'}
        variants={navStyles}
      >
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.div
                className="text-2xl font-display"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-text-primary">Creative</span>
                <span className="text-accent-primary">Dev</span>
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  style={{
                    transform: `translate(${item.offset.x}px, ${item.offset.y}px)`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: item.offset.y }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 transition-colors ${
                      item.isAccent
                        ? 'bg-accent-primary text-bg-dark rounded-full hover:bg-accent-hover'
                        : pathname === item.href
                        ? 'text-accent-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && !item.isAccent && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* 3D Theme Toggle Orb */}
              <ThemeToggle3D 
                isDark={isDarkMode} 
                onChange={setIsDarkMode} 
              />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-bg-card transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bg-dark/90 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="relative h-full flex flex-col justify-center items-center gap-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`text-2xl font-display ${
                      item.isAccent
                        ? 'text-accent-primary'
                        : pathname === item.href
                        ? 'text-accent-primary'
                        : 'text-text-primary hover:text-accent-primary'
                    } transition-colors`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="mt-8 p-3 rounded-full bg-bg-card hover:bg-bg-section-2 transition-colors"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {isDarkMode ? (
                  <FiSun className="w-6 h-6 text-highlight" />
                ) : (
                  <FiMoon className="w-6 h-6 text-accent-primary" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}