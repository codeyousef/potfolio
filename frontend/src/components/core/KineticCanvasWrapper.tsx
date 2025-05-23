import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'

interface KineticCanvasWrapperProps {
  children: ReactNode
}

const KineticCanvasWrapper: React.FC<KineticCanvasWrapperProps> = ({ children }) => {
  const { currentPhase } = useAethelframeStore()
  
  // Animation variants based on the current phase
  const wrapperVariants = {
    seed: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    growth: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    bloom: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }
  
  return (
    <motion.div 
      className={`kinetic-canvas-wrapper w-full h-full min-h-screen flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={wrapperVariants[currentPhase]}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
    >
      {/* Phase-specific background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {currentPhase === 'seed' && (
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-teal-accent/5 blur-3xl"></div>
          </div>
        )}
        
        {currentPhase === 'growth' && (
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-teal-accent/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1/3 h-1/3 rounded-full bg-navy-accent/10 blur-3xl"></div>
          </div>
        )}
        
        {currentPhase === 'bloom' && (
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-teal-accent/15 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1/3 h-1/3 rounded-full bg-navy-accent/15 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-maroon-accent/10 blur-3xl"></div>
          </div>
        )}
      </div>
      
      {children}
    </motion.div>
  )
}

export default KineticCanvasWrapper