import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: string;
  impact: 'low' | 'medium' | 'high' | 'quantum';
}

const timelineData: TimelineEvent[] = [
  {
    year: 2018,
    title: "THE AWAKENING",
    description: "Started with HTML/CSS. Thought <div> was pronounced 'dive'. Made websites that looked like 1995.",
    category: "frontend",
    impact: "low"
  },
  {
    year: 2019,
    title: "JAVASCRIPT ENLIGHTENMENT",
    description: "Discovered console.log(). Used it 10,000 times. Still do. No regrets.",
    category: "frontend",
    impact: "medium"
  },
  {
    year: 2020,
    title: "REACT REVOLUTION",
    description: "useState() changed my state. useEffect() had side effects on my sleep schedule.",
    category: "frontend",
    impact: "high"
  },
  {
    year: 2021,
    title: "BACKEND BREAKTHROUGH",
    description: "Learned Node.js. Realized JavaScript runs everywhere. Began questioning reality.",
    category: "backend",
    impact: "high"
  },
  {
    year: 2022,
    title: "THREE.JS TRANSCENDENCE",
    description: "Started making 3D websites. Clients confused. Users amazed. GPUs crying.",
    category: "frontend",
    impact: "quantum"
  },
  {
    year: 2023,
    title: "AI INTEGRATION",
    description: "Befriended AI. Now we pair program. It writes comments, I write bugs.",
    category: "tools",
    impact: "quantum"
  },
  {
    year: 2024,
    title: "CHAOS ARCHITECTURE",
    description: "Perfected the art of organized chaos. This portfolio is the result.",
    category: "emerging",
    impact: "quantum"
  }
];

const categoryColors: Record<string, string> = {
  frontend: '#00F5FF',
  backend: '#FF006E',
  tools: '#FFBE0B',
  emerging: '#8B00FF'
};

interface TechTimelineProps {
  activeCategory: string;
}

export default function TechTimeline({ activeCategory }: TechTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [quantumGlitch, setQuantumGlitch] = useState(false);

  useEffect(() => {
    // Random quantum glitches
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setQuantumGlitch(true);
        setTimeout(() => setQuantumGlitch(false), 500);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const filteredEvents = activeCategory === 'all' 
    ? timelineData 
    : timelineData.filter(event => event.category === activeCategory);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Timeline line */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
        style={{
          background: `linear-gradient(180deg, ${categoryColors[activeCategory] || '#FFF'} 0%, transparent 100%)`,
          filter: quantumGlitch ? 'hue-rotate(180deg)' : 'none'
        }}
      />

      {/* Events */}
      <div className="relative space-y-12">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={`${event.year}-${event.title}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`relative w-5/12 cursor-pointer group ${
                index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              {/* Quantum connection line */}
              <div 
                className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 ${
                  index % 2 === 0 ? 'right-0' : 'left-0'
                }`}
                style={{
                  background: categoryColors[event.category],
                  boxShadow: `0 0 10px ${categoryColors[event.category]}`,
                  animation: event.impact === 'quantum' ? 'quantumPulse 2s infinite' : 'none'
                }}
              />

              {/* Event node */}
              <div 
                className={`absolute top-1/2 transform -translate-y-1/2 ${
                  index % 2 === 0 ? '-right-12' : '-left-12'
                }`}
              >
                <div 
                  className="relative w-6 h-6 rounded-full"
                  style={{
                    background: categoryColors[event.category],
                    boxShadow: `0 0 20px ${categoryColors[event.category]}`,
                    animation: event.impact === 'quantum' ? 'quantumSpin 3s linear infinite' : 'none'
                  }}
                >
                  {event.impact === 'quantum' && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: categoryColors[event.category] }}
                    />
                  )}
                </div>
              </div>

              {/* Event content */}
              <div className="group-hover:scale-105 transition-transform">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    color: categoryColors[event.category],
                    textShadow: `0 0 20px ${categoryColors[event.category]}40`
                  }}
                >
                  {event.year}
                </h3>
                <h4 className="text-xl mb-2 text-white">
                  {event.title}
                </h4>
                <p className="text-sm opacity-70">
                  {event.description}
                </p>
                
                {/* Impact indicator */}
                <div className="mt-2 flex gap-1 justify-center">
                  {['low', 'medium', 'high', 'quantum'].map((level) => (
                    <div 
                      key={level}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: ['low', 'medium', 'high', 'quantum'].indexOf(level) <= 
                          ['low', 'medium', 'high', 'quantum'].indexOf(event.impact)
                          ? categoryColors[event.category]
                          : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected event detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <div className="absolute inset-0 bg-black/80" />
            <motion.div 
              className="relative max-w-2xl w-full p-8 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${categoryColors[selectedEvent.category]}20 0%, transparent 50%)`,
                border: `2px solid ${categoryColors[selectedEvent.category]}`,
                boxShadow: `0 0 50px ${categoryColors[selectedEvent.category]}40`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 
                className="text-4xl font-bold mb-4"
                style={{ color: categoryColors[selectedEvent.category] }}
              >
                {selectedEvent.title}
              </h2>
              <p className="text-xl mb-4">{selectedEvent.year}</p>
              <p className="text-lg opacity-80">{selectedEvent.description}</p>
              
              {selectedEvent.impact === 'quantum' && (
                <div className="mt-6 p-4 border border-white/20 rounded">
                  <p className="text-sm opacity-60">
                    ⚠️ QUANTUM ACHIEVEMENT: This milestone exists in multiple realities simultaneously.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes quantumPulse {
          0%, 100% { opacity: 1; transform: scaleX(1); }
          50% { opacity: 0.5; transform: scaleX(1.5); }
        }
        
        @keyframes quantumSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}