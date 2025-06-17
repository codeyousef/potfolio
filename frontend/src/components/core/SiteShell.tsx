import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'

// Import Aurora Portal System components
import PortalBeam from './PortalBeam'
import FloatingParticles from './FloatingParticles'
import CrystalOrbNavigation from '@components/navigation/CrystalOrbNavigation'
import FloatingGlassShard from './FloatingGlassShard'

interface SiteShellProps {
  children: ReactNode
}


// Main SiteShell component
const SiteShell: React.FC<SiteShellProps> = ({ children }) => {
  const { currentPhase, setActiveCanvas } = useAethelframeStore()

  // Navigation items for crystal orbs
  const navigationItems = [
    { id: 'home', icon: '🏠', label: 'Home', onClick: () => setActiveCanvas('home') },
    { id: 'portfolio', icon: '💼', label: 'Portfolio', onClick: () => setActiveCanvas('portfolio') },
    { id: 'services', icon: '⚡', label: 'Services', onClick: () => setActiveCanvas('services') },
    { id: 'journal', icon: '📖', label: 'Journal', onClick: () => setActiveCanvas('journal') },
    { id: 'contact', icon: '📧', label: 'Contact', onClick: () => setActiveCanvas('contact') },
  ]

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
      className={`site-shell phase-${currentPhase} w-full flex flex-col relative`}
      initial={{ opacity: 0 }}
      animate={containerVariants[currentPhase]}
      style={{ background: '#000000', minHeight: '100vh', overflow: 'visible' }}
    >
      {/* Portal Beam (Central Visual Element) */}
      <PortalBeam intensity={1} />
      
      {/* Floating Particles Background */}
      <FloatingParticles 
        count={150} 
        portalPosition={{ x: 50, y: 50 }} 
      />
      
      {/* Crystal Orb Navigation */}
      <CrystalOrbNavigation 
        items={navigationItems}
        portalPosition={{ x: 50, y: 30 }}
        radius={200}
      />

      {/* Content Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center">
        {children}
      </main>

      {/* Footer with Floating Glass Shard */}
      <footer className="relative z-10">
        <FloatingGlassShard 
          position={{ x: 50, y: 90 }}
          distanceFromPortal={300}
          rotation={2}
          shape="hexagon"
        >
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Aethelframe Protocol. All rights reserved.
          </p>
        </FloatingGlassShard>
      </footer>
    </motion.div>
  )
}

export default SiteShell
