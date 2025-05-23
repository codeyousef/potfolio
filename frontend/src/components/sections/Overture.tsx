import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface OvertureProps {
  onComplete: () => void
}

const Overture: React.FC<OvertureProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [autoProgress, setAutoProgress] = useState(true)
  
  // Text content for each step
  const steps = [
    {
      title: "Welcome to Aethelframe Protocol",
      subtitle: "A journey through digital craftsmanship",
      description: "This portfolio represents an exploration of design, technology, and creative expression."
    },
    {
      title: "The Emergence Theme",
      subtitle: "Three phases of revelation",
      description: "Experience the portfolio through the lens of emergence: Seed, Growth, and Bloom."
    },
    {
      title: "Begin Your Journey",
      subtitle: "Navigate through the experience",
      description: "Explore projects, services, and thoughts as you move through the phases of emergence."
    }
  ]
  
  // Auto-progress through steps
  useEffect(() => {
    if (!autoProgress) return
    
    const timer = setTimeout(() => {
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        onComplete()
      }
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [step, autoProgress, steps.length, onComplete])
  
  // Handle manual navigation
  const handleNext = () => {
    setAutoProgress(false)
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }
  
  const handleSkip = () => {
    setAutoProgress(false)
    onComplete()
  }
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }
  }
  
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: 'easeOut',
        staggerChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.5, 
        ease: 'easeIn' 
      } 
    }
  }
  
  return (
    <motion.div 
      className="overture phase-seed fixed inset-0 flex items-center justify-center bg-deep-black"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-teal-accent/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1/3 h-1/3 rounded-full bg-navy-accent/10 blur-3xl"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key={step}
        >
          <motion.h1 
            className="text-h2 md:text-h1 font-secondary font-bold mb-4"
            variants={textVariants}
          >
            <span className="accent">{steps[step].title}</span>
          </motion.h1>
          
          <motion.h2 
            className="text-h4 md:text-h3 font-secondary font-medium mb-6"
            variants={textVariants}
          >
            {steps[step].subtitle}
          </motion.h2>
          
          <motion.p 
            className="text-body mb-12"
            variants={textVariants}
          >
            {steps[step].description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-center gap-4"
            variants={textVariants}
          >
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-teal-accent text-white rounded-full text-small uppercase tracking-wider transition-all hover:bg-teal-accent/90"
            >
              {step < steps.length - 1 ? 'Continue' : 'Enter'}
            </button>
            
            {step < steps.length - 1 && (
              <button 
                onClick={handleSkip}
                className="px-8 py-3 border border-gray-700 rounded-full text-small uppercase tracking-wider transition-all hover:border-teal-accent/50"
              >
                Skip Introduction
              </button>
            )}
          </motion.div>
        </motion.div>
        
        {/* Progress indicators */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === step ? 'bg-teal-accent' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Overture