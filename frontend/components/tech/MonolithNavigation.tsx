'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Clock component for time display
const Clock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };
  
  return (
    <span className="tracking-wider">
      {formatTime(time)} EST
    </span>
  );
};

export default function MonolithNavigation() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { label: 'Work', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Journal', href: '#journal' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];
  
  return (
    <>
      {/* Fixed Position Indicator */}
      <div 
        style={{
          position: 'fixed',
          top: '32px',
          left: '32px',
          zIndex: 50,
          width: '48px',
          height: '1px',
          backgroundColor: 'var(--light-40)',
          transition: 'all 700ms cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      />
      
      {/* Logo Mark - Minimal */}
      <div 
        style={{
          position: 'fixed',
          top: '32px',
          right: '32px',
          zIndex: 50,
          cursor: 'pointer',
          transition: 'all 700ms cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle 
            cx="12" 
            cy="12" 
            r="11" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
            opacity="0.4" 
          />
          <circle 
            cx="12" 
            cy="12" 
            r="2" 
            fill="white" 
            opacity="0.8" 
          />
        </svg>
      </div>
      
      {/* Hidden Menu - Reveals on Scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
            }}
          >
            {/* Subtle gradient line */}
            <div 
              style={{
                height: '1px',
                background: 'linear-gradient(to right, transparent, var(--light-20), transparent)'
              }}
            />
            
            {/* Nav content */}
            <div 
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div 
                style={{
                  maxWidth: '1920px',
                  margin: '0 auto',
                  padding: '24px 32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* Minimal Text Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="link"
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 'var(--text-12)',
                        fontWeight: 'var(--weight-light)',
                        color: 'var(--light-60)',
                        letterSpacing: 'var(--tracking-wider)',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'none',
                        transition: 'color 700ms cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--light-60)';
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                
                {/* Time & Location */}
                <div 
                  style={{
                    fontSize: 'var(--text-12)',
                    fontWeight: 'var(--weight-light)',
                    color: 'var(--light-40)',
                    letterSpacing: 'var(--tracking-wider)'
                  }}
                >
                  <Clock />
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}