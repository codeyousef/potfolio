import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentPhase, activeCanvasId, setActiveCanvas } = useAethelframeStore()
  
  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'portfolio', label: 'Projects', path: '/projects' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'journal', label: 'Journal', path: '/journal' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ]
  
  // Animation variants based on the current phase
  const navVariants = {
    seed: {
      opacity: 0.7,
      y: 0,
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    growth: {
      opacity: 0.9,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    bloom: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }
  
  // Item animation variants
  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <motion.nav 
      className={`
        py-4 px-6 md:px-12 
        backdrop-blur-md 
        ${currentPhase === 'seed' ? 'bg-deep-black/70' : ''}
        ${currentPhase === 'growth' ? 'bg-gray-900/80' : ''}
        ${currentPhase === 'bloom' ? 'bg-gray-900/90' : ''}
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={navVariants[currentPhase]}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-h5 font-secondary font-bold">
          <span className="accent">Aethelframe</span> Protocol
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className={`
                text-small uppercase tracking-wider transition-all duration-300
                ${activeCanvasId === item.id ? 'text-teal-accent font-medium' : 'hover:text-teal-accent/70'}
              `}
              onClick={() => setActiveCanvas(item.id as any)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md py-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-6 flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="closed"
                animate="open"
                variants={itemVariants}
              >
                <Link
                  to={item.path}
                  className={`
                    block py-2 text-small uppercase tracking-wider transition-all duration-300
                    ${activeCanvasId === item.id ? 'text-teal-accent font-medium' : 'hover:text-teal-accent/70'}
                  `}
                  onClick={() => {
                    setActiveCanvas(item.id as any)
                    setIsMenuOpen(false)
                  }}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navigation