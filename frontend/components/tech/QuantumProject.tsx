'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectState {
  timeline: 'success' | 'failure' | 'pivot';
  title: string;
  description: string;
  metrics: {
    users: string;
    revenue: string;
    impact: string;
  };
}

interface QuantumProjectProps {
  projectId: string;
  projectName: string;
  isObserved: boolean;
  onObserve: () => void;
}

const projectStates: Record<string, ProjectState[]> = {
  'schrodinger-app': [
    {
      timeline: 'success',
      title: 'Revolutionary App Platform',
      description: 'Changed the entire industry overnight',
      metrics: { users: '10M+', revenue: '$50M', impact: 'MASSIVE' }
    },
    {
      timeline: 'failure',
      title: 'Learning Experience',
      description: 'Failed spectacularly but beautifully',
      metrics: { users: '12', revenue: '-$50k', impact: 'HUMBLING' }
    },
    {
      timeline: 'pivot',
      title: 'Unexpected Meme Generator',
      description: 'Became something else entirely',
      metrics: { users: '100k', revenue: '$2M', impact: 'SURPRISING' }
    }
  ],
  'quantum-commerce': [
    {
      timeline: 'success',
      title: 'Next-Gen Shopping Experience',
      description: 'Forbes called it "The Future"',
      metrics: { users: '5M+', revenue: '$100M', impact: 'REVOLUTIONARY' }
    },
    {
      timeline: 'failure',
      title: 'Ambitious Experiment',
      description: 'TechCrunch called it "Too Early"',
      metrics: { users: '1k', revenue: '-$200k', impact: 'EDUCATIONAL' }
    },
    {
      timeline: 'pivot',
      title: 'B2B Analytics Platform',
      description: 'Pivoted to enterprise successfully',
      metrics: { users: '500', revenue: '$5M', impact: 'STRATEGIC' }
    }
  ],
  'multiverse-chat': [
    {
      timeline: 'success',
      title: 'Global Communication Revolution',
      description: 'Connected parallel universes',
      metrics: { users: '∞', revenue: '∞', impact: 'INFINITE' }
    },
    {
      timeline: 'failure',
      title: 'Paradox Creator',
      description: 'Caused too many timeline conflicts',
      metrics: { users: '-1', revenue: 'NaN', impact: 'CATASTROPHIC' }
    },
    {
      timeline: 'pivot',
      title: 'Fiction Writing Tool',
      description: 'Writers loved the chaos',
      metrics: { users: '50k', revenue: '$500k', impact: 'CREATIVE' }
    }
  ],
  'probability-engine': [
    {
      timeline: 'success',
      title: 'Quantum Computing Breakthrough',
      description: 'Solved P vs NP (maybe)',
      metrics: { users: 'Governments', revenue: 'Classified', impact: 'HISTORIC' }
    },
    {
      timeline: 'failure',
      title: 'Expensive Random Generator',
      description: 'Just made really good random numbers',
      metrics: { users: '3', revenue: '-$1M', impact: 'RANDOM' }
    },
    {
      timeline: 'pivot',
      title: 'Casino Algorithm',
      description: 'Vegas wasn\'t happy',
      metrics: { users: 'Banned', revenue: '$10M', impact: 'CONTROVERSIAL' }
    }
  ],
  'timeline-navigator': [
    {
      timeline: 'success',
      title: 'Time Travel Interface',
      description: 'Finally made it work',
      metrics: { users: 'Everyone', revenue: 'Priceless', impact: 'TEMPORAL' }
    },
    {
      timeline: 'failure',
      title: 'Fancy Calendar App',
      description: 'Just another scheduling tool',
      metrics: { users: '10k', revenue: '$0', impact: 'MUNDANE' }
    },
    {
      timeline: 'pivot',
      title: 'Historical Documentation Tool',
      description: 'Historians love it',
      metrics: { users: '25k', revenue: '$1M', impact: 'ACADEMIC' }
    }
  ],
  'reality-compiler': [
    {
      timeline: 'success',
      title: 'Reality Programming Language',
      description: 'Code that changes the world, literally',
      metrics: { users: 'Wizards', revenue: 'Magic', impact: 'REALITY-BENDING' }
    },
    {
      timeline: 'failure',
      title: 'Confusing IDE',
      description: 'No one understood the syntax',
      metrics: { users: '1 (me)', revenue: '-$100k', impact: 'CONFUSED' }
    },
    {
      timeline: 'pivot',
      title: 'VR Development Platform',
      description: 'Found its niche in gaming',
      metrics: { users: '75k', revenue: '$3M', impact: 'IMMERSIVE' }
    }
  ]
};

export default function QuantumProject({ projectId, projectName, isObserved, onObserve }: QuantumProjectProps) {
  const [collapsedState, setCollapsedState] = useState<ProjectState | null>(null);
  const possibleStates = projectStates[projectId] || projectStates['schrodinger-app'];

  const handleObservation = () => {
    if (!isObserved) {
      // Collapse to random state
      const randomState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
      setCollapsedState(randomState);
      onObserve();
      
      // Create quantum ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'quantum-ripple';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
  };

  return (
    <motion.div 
      className="relative cursor-pointer"
      onMouseEnter={handleObservation}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {!isObserved ? (
        /* Superposition state - all possibilities visible */
        <div className="superposition-container">
          {possibleStates.map((state, i) => (
            <motion.div
              key={state.timeline}
              className={`quantum-state ${state.timeline}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.6,
                rotate: i * 3 - 3,
                scale: 1 - i * 0.05
              }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-2xl mb-4">{state.title}</h3>
              <p className="text-gray-400 mb-4">{state.description}</p>
              <div className="text-sm opacity-60">
                {projectName} - Timeline {state.timeline.toUpperCase()}
              </div>
            </motion.div>
          ))}
          
          {/* Quantum uncertainty indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="text-8xl font-bold"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [0.9, 1.1, 0.9],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              style={{ 
                color: 'var(--reality-prime)',
                textShadow: '0 0 30px currentColor'
              }}
            >
              ?
            </motion.div>
          </div>
          
          {/* Hover instruction */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-sm opacity-40">Hover to observe</p>
          </div>
        </div>
      ) : (
        /* Collapsed state - single reality */
        <AnimatePresence mode="wait">
          <motion.div 
            key="collapsed"
            className="p-8 border-2 bg-black/80 backdrop-blur"
            initial={{ scale: 0.8, opacity: 0, rotate: 180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ 
              borderColor: 
                collapsedState?.timeline === 'success' ? 'var(--reality-prime)' :
                collapsedState?.timeline === 'failure' ? 'var(--reality-alpha)' :
                'var(--reality-beta)'
            }}
          >
            <h3 className="text-3xl mb-4">{collapsedState?.title}</h3>
            <p className="text-xl mb-6">{collapsedState?.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {collapsedState && Object.entries(collapsedState.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-sm opacity-60 uppercase">{key}</div>
                  <div className="text-2xl font-bold" style={{
                    color: 
                      collapsedState.timeline === 'success' ? 'var(--reality-prime)' :
                      collapsedState.timeline === 'failure' ? 'var(--reality-alpha)' :
                      'var(--reality-beta)'
                  }}>{value}</div>
                </div>
              ))}
            </div>
            
            {/* Timeline indicator */}
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-60">
                Timeline: {collapsedState?.timeline.toUpperCase()}
              </div>
              <div className="text-xs opacity-40">
                State collapsed: {projectName}
              </div>
            </div>
            
            {/* Observer effect notice */}
            <div className="observer-notice">
              Your observation collapsed this reality at {new Date().toLocaleTimeString()}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}