'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the emergence phases
export type EmergencePhase = 'seed' | 'growth' | 'bloom';

// Define the context interface
interface EmergenceContextType {
  currentPhase: EmergencePhase;
  setCurrentPhase: (phase: EmergencePhase) => void;
  progressPhase: () => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
  phaseProgress: number; // 0-100 for animations that need smooth transitions
  setPhaseProgress: (progress: number) => void;
}

// Create the context with default values
const EmergenceContext = createContext<EmergenceContextType>({
  currentPhase: 'seed',
  setCurrentPhase: () => {},
  progressPhase: () => {},
  isTransitioning: false,
  setIsTransitioning: () => {},
  phaseProgress: 0,
  setPhaseProgress: () => {},
});

// Custom hook to use the emergence context
export const useEmergence = () => useContext(EmergenceContext);

// Provider component that wraps the app
interface EmergenceProviderProps {
  children: ReactNode;
  initialPhase?: EmergencePhase;
}

export default function EmergenceProvider({
  children,
  initialPhase = 'seed',
}: EmergenceProviderProps) {
  // State for the current phase
  const [currentPhase, setCurrentPhase] = useState<EmergencePhase>(initialPhase);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Apply the appropriate body class based on the current phase
  useEffect(() => {
    // Remove all phase classes
    document.body.classList.remove('phase-seed', 'phase-growth', 'phase-bloom');
    
    // Add the current phase class
    document.body.classList.add(`phase-${currentPhase}`);
  }, [currentPhase]);

  // Function to progress to the next phase
  const progressPhase = () => {
    setIsTransitioning(true);
    
    // Define the phase progression
    if (currentPhase === 'seed') {
      setCurrentPhase('growth');
    } else if (currentPhase === 'growth') {
      setCurrentPhase('bloom');
    }
    // If already at bloom, stay there
    
    // Reset transition state after a delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // Adjust based on transition duration
  };

  // Provide the context to children components
  return (
    <EmergenceContext.Provider
      value={{
        currentPhase,
        setCurrentPhase,
        progressPhase,
        isTransitioning,
        setIsTransitioning,
        phaseProgress,
        setPhaseProgress,
      }}
    >
      {children}
    </EmergenceContext.Provider>
  );
}
