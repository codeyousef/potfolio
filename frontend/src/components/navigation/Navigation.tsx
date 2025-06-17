import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentPhase, activeCanvasId, setActiveCanvas } = useAethelframeStore()
  const navRef = useRef<HTMLDivElement>(null)

  // Add dynamic light reflection based on cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return

      const rect = navRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      navRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(255, 255, 255, 0.1) 0%, 
          transparent 60%),
        linear-gradient(135deg, var(--glass-teal) 0%, transparent 40%),
        linear-gradient(225deg, var(--glass-maroon) 0%, transparent 40%),
        radial-gradient(ellipse at top, var(--glass-navy), transparent 50%)
      `
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'portfolio', label: 'Projects', path: '/projects' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'journal', label: 'Journal', path: '/journal' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'liquid-glass', label: 'Liquid Glass UI', path: '/liquid-glass' },
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
      ref={navRef}
      className={`
        liquid-glass
        py-4 px-6 md:px-12 
        border-b border-white/5
        animate-[materialize_0.5s_ease-out_forwards]
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
        <div className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className={`
                text-small uppercase tracking-wider transition-all duration-300
                px-4 py-2 rounded-xl
                ${activeCanvasId === item.id 
                  ? 'text-white font-medium border border-teal-accent/40 shadow-[0_0_20px_rgba(56,178,172,0.3)]' 
                  : 'hover:text-white hover:border-teal-accent/20 hover:shadow-[0_0_10px_rgba(56,178,172,0.1)]'}
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
          className="md:hidden absolute top-full left-0 w-full liquid-glass py-4 mt-1 rounded-b-2xl"
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
                    block py-3 px-4 my-1 text-small uppercase tracking-wider transition-all duration-300
                    rounded-xl
                    ${activeCanvasId === item.id 
                      ? 'text-white font-medium border border-teal-accent/40 shadow-[0_0_20px_rgba(56,178,172,0.3)]' 
                      : 'hover:text-white hover:border-teal-accent/20 hover:shadow-[0_0_10px_rgba(56,178,172,0.1)]'}
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
