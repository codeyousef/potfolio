'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QuantumBiographyProps {
  quantumState: number;
  activeTimeline: string;
}

const biographyStates = {
  prime: {
    checkboxes: [
      { label: 'A developer who dreams in code', checked: true },
      { label: 'A designer who codes their dreams', checked: false },
      { label: 'An artist trapped in a developer\'s body', checked: false },
      { label: 'A developer trapped in an artist\'s mind', checked: false },
      { label: 'All of the above', checked: false },
      { label: 'None of the above', checked: false },
      { label: 'The question is meaningless', checked: true }
    ],
    skills: {
      'React': 'strong force',
      'Three.js': 'electromagnetic',
      'Coffee': 'gravitational',
      'Sleep': 'weak force - very weak'
    },
    states: [
      'Definitely caffeinated',
      'Probably debugging something',
      'Possibly in your timeline',
      'Certainly uncertain'
    ]
  },
  alpha: {
    checkboxes: [
      { label: 'A developer who dreams in code', checked: false },
      { label: 'A designer who codes their dreams', checked: true },
      { label: 'An artist trapped in a developer\'s body', checked: true },
      { label: 'A developer trapped in an artist\'s mind', checked: false },
      { label: 'All of the above', checked: false },
      { label: 'None of the above', checked: false },
      { label: 'The question is meaningless', checked: true }
    ],
    skills: {
      'Figma': 'strong force',
      'Photoshop': 'electromagnetic',
      'Creativity': 'gravitational',
      'Deadlines': 'weak force - very weak'
    },
    states: [
      'Aesthetically driven',
      'Probably critiquing fonts',
      'Possibly making it prettier',
      'Certainly colorful'
    ]
  },
  beta: {
    checkboxes: [
      { label: 'A developer who dreams in code', checked: false },
      { label: 'A designer who codes their dreams', checked: false },
      { label: 'An artist trapped in a developer\'s body', checked: false },
      { label: 'A developer trapped in an artist\'s mind', checked: false },
      { label: 'All of the above', checked: true },
      { label: 'None of the above', checked: false },
      { label: 'The question is meaningless', checked: false }
    ],
    skills: {
      'Leadership': 'strong force',
      'Vision': 'electromagnetic',
      'Networking': 'gravitational',
      'Work-life balance': 'weak force - very weak'
    },
    states: [
      'Definitely disrupting',
      'Probably fundraising',
      'Possibly pivoting',
      'Certainly ambitious'
    ]
  },
  gamma: {
    checkboxes: [
      { label: 'A developer who dreams in code', checked: true },
      { label: 'A designer who codes their dreams', checked: true },
      { label: 'An artist trapped in a developer\'s body', checked: true },
      { label: 'A developer trapped in an artist\'s mind', checked: true },
      { label: 'All of the above', checked: false },
      { label: 'None of the above', checked: false },
      { label: 'The question is meaningless', checked: false }
    ],
    skills: {
      'Freedom': 'strong force',
      'Adventure': 'electromagnetic',
      'WiFi': 'gravitational',
      'Stability': 'weak force - very weak'
    },
    states: [
      'Location independent',
      'Probably in Bali',
      'Possibly on a beach',
      'Certainly wandering'
    ]
  }
};

export default function QuantumBiography({ quantumState, activeTimeline }: QuantumBiographyProps) {
  const [glitchText, setGlitchText] = useState(false);
  const currentBio = biographyStates[activeTimeline as keyof typeof biographyStates] || biographyStates.prime;

  useEffect(() => {
    // Random glitches based on quantum state
    const glitchInterval = setInterval(() => {
      if (Math.random() < quantumState) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, [quantumState]);

  return (
    <div className="space-y-8">
      {/* Who Am I Section */}
      <motion.div 
        className="space-y-4"
        animate={{ 
          filter: glitchText ? 'blur(2px)' : 'blur(0px)',
          x: glitchText ? [-2, 2, -2, 0] : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-2xl mb-4" style={{ color: 'var(--reality-prime)' }}>
          WHO AM I?
        </h3>
        
        <div className="space-y-2">
          {currentBio.checkboxes.map((item, i) => (
            <motion.div 
              key={i}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-5 h-5 border-2 border-white relative">
                {item.checked && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  />
                )}
              </div>
              <span className={item.checked ? 'opacity-100' : 'opacity-60'}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Superposition Statement */}
      <motion.div
        className="text-xl italic text-center py-8"
        style={{ color: 'var(--reality-alpha)' }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        I exist in a superposition of skills until hired.
        <br />
        Upon observation (interview), I collapse into exactly what you need.
      </motion.div>

      {/* Profound or Pretentious */}
      <div className="text-center text-lg">
        <p className="mb-2">This is either profound or pretentious.</p>
        <p style={{ color: 'var(--reality-beta)' }}>
          The universe hasn't decided yet.
        </p>
      </div>

      {/* Known States */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl mb-4" style={{ color: 'var(--reality-gamma)' }}>
            KNOWN STATES:
          </h4>
          <ul className="space-y-2">
            {currentBio.states.map((state, i) => (
              <motion.li
                key={state}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-2"
              >
                <span className="text-lg">•</span>
                <span>{state}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl mb-4" style={{ color: 'var(--reality-prime)' }}>
            QUANTUM ENTANGLEMENTS:
          </h4>
          <ul className="space-y-2">
            {Object.entries(currentBio.skills).map(([skill, force], i) => (
              <motion.li
                key={skill}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between"
              >
                <span>{skill}</span>
                <span className="text-sm opacity-60">({force})</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline-specific message */}
      <motion.div
        className="mt-8 p-6 border-2 text-center"
        style={{ 
          borderColor: 
            activeTimeline === 'prime' ? 'var(--reality-prime)' :
            activeTimeline === 'alpha' ? 'var(--reality-alpha)' :
            activeTimeline === 'beta' ? 'var(--reality-beta)' :
            'var(--reality-gamma)'
        }}
        animate={{
          boxShadow: [
            `0 0 20px ${activeTimeline === 'prime' ? 'var(--reality-prime)' :
              activeTimeline === 'alpha' ? 'var(--reality-alpha)' :
              activeTimeline === 'beta' ? 'var(--reality-beta)' :
              'var(--reality-gamma)'}40`,
            `0 0 40px ${activeTimeline === 'prime' ? 'var(--reality-prime)' :
              activeTimeline === 'alpha' ? 'var(--reality-alpha)' :
              activeTimeline === 'beta' ? 'var(--reality-beta)' :
              'var(--reality-gamma)'}20`,
            `0 0 20px ${activeTimeline === 'prime' ? 'var(--reality-prime)' :
              activeTimeline === 'alpha' ? 'var(--reality-alpha)' :
              activeTimeline === 'beta' ? 'var(--reality-beta)' :
              'var(--reality-gamma)'}40`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <p className="text-lg">
          {activeTimeline === 'prime' && 'In this timeline, I write elegant code that occasionally works.'}
          {activeTimeline === 'alpha' && 'In this timeline, I paint with pixels and dream in gradients.'}
          {activeTimeline === 'beta' && 'In this timeline, I disrupt industries before breakfast.'}
          {activeTimeline === 'gamma' && 'In this timeline, my office is wherever WiFi exists.'}
        </p>
      </motion.div>
    </div>
  );
}