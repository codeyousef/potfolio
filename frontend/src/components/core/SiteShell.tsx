import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@components/navigation/Navigation'
import { useAethelframeStore } from '@store/useAethelframeStore'

interface SiteShellProps {
  children: ReactNode
}

const SiteShell: React.FC<SiteShellProps> = ({ children }) => {
  const { currentPhase } = useAethelframeStore()
  
  // Animation variants based on the current phase
  const containerVariants = {
    seed: {
      opacity: 1,
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    growth: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    bloom: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }
  
  return (
    <motion.div 
      className={`site-shell phase-${currentPhase} min-h-screen w-full flex flex-col`}
      initial={{ opacity: 0 }}
      animate={containerVariants[currentPhase]}
    >
      <header className="fixed top-0 left-0 w-full z-50">
        <Navigation />
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-small">
        <p>© {new Date().getFullYear()} Aethelframe Protocol. All rights reserved.</p>
      </footer>
    </motion.div>
  )
}

export default SiteShell