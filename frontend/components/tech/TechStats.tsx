import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TechStatsProps {
  category: string;
}

// Simulated real-time metrics
const generateMetrics = () => ({
  linesWritten: Math.floor(Math.random() * 1000) + 50000,
  bugsFixed: Math.floor(Math.random() * 500) + 2000,
  bugsCreated: Math.floor(Math.random() * 600) + 2100,
  coffeeConsumed: Math.floor(Math.random() * 100) + 3000,
  stackOverflowVisits: Math.floor(Math.random() * 1000) + 10000,
  gitCommits: Math.floor(Math.random() * 500) + 5000,
  deployments: Math.floor(Math.random() * 100) + 500,
  crashesCaused: Math.floor(Math.random() * 50) + 10,
  crashesFixed: Math.floor(Math.random() * 49) + 10,
  hoursDebugging: Math.floor(Math.random() * 500) + 2000,
  hoursGoogling: Math.floor(Math.random() * 600) + 2500,
  npmPackagesInstalled: Math.floor(Math.random() * 1000) + 5000,
});

const categoryMultipliers: Record<string, number> = {
  frontend: 1.2,
  backend: 1.1,
  tools: 0.9,
  emerging: 0.7
};

export default function TechStats({ category }: TechStatsProps) {
  const [metrics, setMetrics] = useState(generateMetrics());
  const [isLive, setIsLive] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        linesWritten: prev.linesWritten + Math.floor(Math.random() * 10),
        bugsFixed: prev.bugsFixed + Math.floor(Math.random() * 2),
        bugsCreated: prev.bugsCreated + Math.floor(Math.random() * 3),
        coffeeConsumed: prev.coffeeConsumed + (Math.random() > 0.8 ? 1 : 0),
        stackOverflowVisits: prev.stackOverflowVisits + Math.floor(Math.random() * 5),
        gitCommits: prev.gitCommits + (Math.random() > 0.7 ? 1 : 0),
        deployments: prev.deployments + (Math.random() > 0.95 ? 1 : 0),
        crashesCaused: prev.crashesCaused + (Math.random() > 0.98 ? 1 : 0),
        crashesFixed: prev.crashesFixed + (Math.random() > 0.98 ? 1 : 0),
        hoursDebugging: prev.hoursDebugging + Math.random() * 0.1,
        hoursGoogling: prev.hoursGoogling + Math.random() * 0.2,
        npmPackagesInstalled: prev.npmPackagesInstalled + (Math.random() > 0.9 ? 1 : 0),
      }));

      // Random glitch effect
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  const multiplier = categoryMultipliers[category] || 1;

  const statItems = [
    { label: 'LINES OF CODE', value: Math.floor(metrics.linesWritten * multiplier), unit: '', color: '#00F5FF' },
    { label: 'BUGS FIXED', value: Math.floor(metrics.bugsFixed * multiplier), unit: '', color: '#00FF00' },
    { label: 'BUGS CREATED', value: Math.floor(metrics.bugsCreated * multiplier), unit: '', color: '#FF0000' },
    { label: 'COFFEE CONSUMED', value: Math.floor(metrics.coffeeConsumed * multiplier), unit: 'cups', color: '#8B4513' },
    { label: 'STACKOVERFLOW VISITS', value: Math.floor(metrics.stackOverflowVisits * multiplier), unit: '', color: '#F48024' },
    { label: 'GIT COMMITS', value: Math.floor(metrics.gitCommits * multiplier), unit: '', color: '#F05032' },
    { label: 'DEPLOYMENTS', value: Math.floor(metrics.deployments * multiplier), unit: '', color: '#0DB7ED' },
    { label: 'CRASHES CAUSED', value: Math.floor(metrics.crashesCaused * multiplier), unit: '', color: '#FF006E' },
    { label: 'CRASHES FIXED', value: Math.floor(metrics.crashesFixed * multiplier), unit: '', color: '#00FF00' },
    { label: 'HOURS DEBUGGING', value: Math.floor(metrics.hoursDebugging * multiplier), unit: 'hrs', color: '#9B59B6' },
    { label: 'HOURS GOOGLING', value: Math.floor(metrics.hoursGoogling * multiplier), unit: 'hrs', color: '#4285F4' },
    { label: 'NPM PACKAGES', value: Math.floor(metrics.npmPackagesInstalled * multiplier), unit: '', color: '#CB3837' },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 overflow-hidden"
    >
      <div 
        className="p-8 rounded-lg relative"
        style={{
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 30px rgba(0,245,255,0.2)',
          filter: glitchActive ? 'hue-rotate(90deg)' : 'none'
        }}
      >
        {/* Live indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <button 
            onClick={() => setIsLive(!isLive)}
            className="text-sm opacity-70 hover:opacity-100"
          >
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-center">
          CAREER STATISTICS DASHBOARD
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <div className="text-xs opacity-60 mb-1">{stat.label}</div>
              <div 
                className="text-2xl md:text-3xl font-mono font-bold"
                style={{ 
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}`,
                  filter: glitchActive && Math.random() > 0.5 ? 'blur(2px)' : 'none'
                }}
              >
                {stat.value.toLocaleString()}
                {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fun facts */}
        <div className="mt-8 p-4 border border-white/10 rounded">
          <p className="text-sm opacity-70 text-center">
            {metrics.bugsCreated > metrics.bugsFixed 
              ? "⚠️ BUG DEBT INCREASING: More bugs created than fixed. This is fine. Everything is fine."
              : "✅ BUG DEBT DECREASING: Actually fixing more bugs than creating. Suspicious..."}
          </p>
        </div>

        {/* Matrix rain effect overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xs font-mono text-green-500"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `matrixFall ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes matrixFall {
          from { transform: translateY(-100%); }
          to { transform: translateY(calc(100vh + 100%)); }
        }
      `}</style>
    </motion.div>
  );
}