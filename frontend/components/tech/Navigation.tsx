'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const navItems = [
  { id: 'work', label: 'Work', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

// Neural Logo Component
function NeuralLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="neural-glow">
      <g>
        {/* Central node */}
        <circle cx="12" cy="12" r="3" fill="#0EA5E9" opacity="0.8">
          <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Orbital nodes */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const radian = (angle * Math.PI) / 180;
          const x = parseFloat((12 + 7 * Math.cos(radian)).toFixed(6));
          const y = parseFloat((12 + 7 * Math.sin(radian)).toFixed(6));
          
          return (
            <g key={i}>
              <line
                x1="12"
                y1="12"
                x2={x}
                y2={y}
                stroke="#8B5CF6"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <circle cx={x} cy={y} r="1.5" fill="#8B5CF6" opacity="0.7">
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.2}s`}
                />
              </circle>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function Navigation() {
  const [activeItem, setActiveItem] = useState('work');
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state
      setScrolled(window.scrollY > 100);
      
      // Update active section
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.querySelector(item.href)
      }));
      
      const current = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveItem(current.id);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{ 
      position: 'fixed', 
      top: '32px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      zIndex: 50 
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px',
          backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '12px 24px',
          textDecoration: 'none'
        }}>
          <NeuralLogo />
        </Link>
        
        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => (
            <div key={item.id} style={{ position: 'relative' }}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.id);
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ 
                  display: 'block',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: 'Inter, sans-serif',
                  color: activeItem === item.id ? 'rgba(250, 250, 250, 1)' : 'rgba(250, 250, 250, 0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.color = 'rgba(250, 250, 250, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.color = 'rgba(250, 250, 250, 0.7)';
                  }
                }}
              >
                {item.label}
              </a>
              {activeItem === item.id && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '24px',
                    right: '24px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #0EA5E9 0%, #8B5CF6 100%)',
                    borderRadius: '1px'
                  }}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div style={{ marginLeft: '32px', marginRight: '8px' }}>
          <button 
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              color: 'white',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2)';
            }}
          >
            Start Project
          </button>
        </div>
      </motion.div>
    </nav>
  );
}