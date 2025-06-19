import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Tech {
  name: string;
  level: number;
  experience: string;
  projects: number | string;
}

interface TechCardProps {
  tech: Tech;
  color: string;
  delay: number;
}

export default function TechCard({ tech, color, delay }: TechCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    
    // Easter egg at 7 clicks
    if (clickCount === 6) {
      alert(`🎉 SECRET UNLOCKED: ${tech.name} was actually invented by aliens. True story.`);
      setClickCount(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-10px) rotateX(5deg)' : 'translateY(0)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      {/* Holographic background */}
      <div 
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, ${color}20 0%, transparent 50%),
            linear-gradient(225deg, ${color}20 0%, transparent 50%),
            linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)
          `,
          border: `1px solid ${color}40`,
          boxShadow: isHovered 
            ? `0 0 30px ${color}60, inset 0 0 30px ${color}20` 
            : `0 0 10px ${color}30`
        }}
      >
        {/* Scanning line effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(0deg, transparent 0%, ${color} 50%, transparent 100%)`,
            height: '2px',
            top: '0',
            animation: 'scan 3s linear infinite'
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, ${color} 0px, transparent 1px, transparent 20px, ${color} 21px),
              repeating-linear-gradient(90deg, ${color} 0px, transparent 1px, transparent 20px, ${color} 21px)
            `
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Tech name with glitch effect */}
        <h3 
          className="text-2xl font-bold mb-4"
          style={{ 
            color: color,
            textShadow: isHovered 
              ? `0 0 10px ${color}, 0 0 20px ${color}60` 
              : 'none'
          }}
        >
          {tech.name}
          {isHovered && (
            <span className="absolute -inset-1 opacity-50" style={{ color }}>
              {tech.name}
            </span>
          )}
        </h3>

        {/* Level indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-70">PROFICIENCY</span>
            <span className="font-mono" style={{ color }}>{tech.level}%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${tech.level}%` }}
              transition={{ delay: delay + 0.3, duration: 1 }}
              style={{
                background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                boxShadow: `0 0 10px ${color}`
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">EXPERIENCE</span>
            <span className="font-mono" style={{ color: color + '99' }}>
              {tech.experience}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">PROJECTS</span>
            <span className="font-mono" style={{ color: color + '99' }}>
              {tech.projects}
            </span>
          </div>
        </div>

        {/* Holographic badge */}
        {tech.level > 85 && (
          <div 
            className="absolute -top-2 -right-2 px-3 py-1 text-xs font-bold rounded-full"
            style={{
              background: color,
              color: '#000',
              boxShadow: `0 0 20px ${color}`,
              animation: 'pulse 2s infinite'
            }}
          >
            EXPERT
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </motion.div>
  );
}