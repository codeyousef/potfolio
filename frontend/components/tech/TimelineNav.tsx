'use client';

import { motion } from 'framer-motion';

interface Timeline {
  id: string;
  label: string;
  stable: boolean;
  locked?: boolean;
}

interface TimelineNavProps {
  activeTimeline: string;
  onTimelineSelect: (timelineId: string) => void;
  quantumStability: number;
}

const timelines: Timeline[] = [
  { id: 'prime', label: 'THIS TIMELINE', stable: true },
  { id: 'alpha', label: 'ARTIST TIMELINE', stable: false },
  { id: 'beta', label: 'CEO TIMELINE', stable: false },
  { id: 'gamma', label: 'NOMAD TIMELINE', stable: false },
  { id: 'omega', label: '???', stable: false, locked: true }
];

export default function TimelineNav({ activeTimeline, onTimelineSelect, quantumStability }: TimelineNavProps) {
  return (
    <nav className="timeline-nav">
      <div className="flex justify-center items-center h-20 space-x-4 md:space-x-8">
        {timelines.map(timeline => (
          <motion.button
            key={timeline.id}
            onClick={() => !timeline.locked && onTimelineSelect(timeline.id)}
            className={`
              timeline-button
              ${timeline.stable ? 'opacity-100' : 'opacity-60'}
              ${timeline.locked ? 'locked cursor-not-allowed' : 'cursor-pointer'}
              ${activeTimeline === timeline.id ? 'active' : ''}
            `}
            style={{
              borderColor: 
                timeline.id === 'prime' ? 'var(--reality-prime)' :
                timeline.id === 'alpha' ? 'var(--reality-alpha)' :
                timeline.id === 'beta' ? 'var(--reality-beta)' :
                timeline.id === 'gamma' ? 'var(--reality-gamma)' :
                'var(--reality-void)',
              backgroundColor: activeTimeline === timeline.id ? 
                (timeline.id === 'prime' ? 'var(--reality-prime)' :
                 timeline.id === 'alpha' ? 'var(--reality-alpha)' :
                 timeline.id === 'beta' ? 'var(--reality-beta)' :
                 timeline.id === 'gamma' ? 'var(--reality-gamma)' :
                 'var(--reality-void)') + '20' : 'transparent'
            }}
            whileHover={!timeline.locked ? { scale: 1.05 } : {}}
            whileTap={!timeline.locked ? { scale: 0.95 } : {}}
            animate={{
              opacity: timeline.stable ? 1 : 0.6 + (quantumStability / 100) * 0.4
            }}
          >
            <span className="relative z-10">
              {timeline.label}
            </span>
            {timeline.locked && (
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔒
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Quantum stability meter */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <motion.div 
          className="h-full"
          style={{ 
            background: `linear-gradient(to right, var(--reality-prime), var(--reality-void))`
          }}
          animate={{
            width: `${quantumStability}%`,
            opacity: quantumStability < 30 ? [0.5, 1, 0.5] : 1
          }}
          transition={{
            width: { duration: 0.3 },
            opacity: { duration: 1, repeat: Infinity }
          }}
        />
      </div>
    </nav>
  );
}