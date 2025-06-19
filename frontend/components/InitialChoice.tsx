'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface InitialChoiceProps {
  onChoice?: () => void;
}

export default function InitialChoice({ onChoice }: InitialChoiceProps) {
  const [show, setShow] = useState(false);
  const [hoveredSide, setHoveredSide] = useState<'boring' | 'chaos' | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already made a choice
    const choice = localStorage.getItem('siteChoice');
    if (!choice) {
      setShow(true);
    }
  }, []);

  const handleChoice = (choice: 'boring' | 'chaos') => {
    localStorage.setItem('siteChoice', choice);
    setShow(false);
    
    if (onChoice) {
      onChoice();
    }
    
    if (choice === 'boring') {
      router.push('/boring');
    }
    // If chaos, they're already on the main page
  };

  if (!show) return null;

  return (
    <>
      {/* Full screen backdrop to hide everything */}
      <div className="fixed inset-0 z-[9998] bg-black"></div>
      
      {/* Choice dialog */}
      <div className="fixed inset-0 z-[9999] flex">
      {/* Boring Side */}
      <div 
        className={`w-1/2 h-full relative overflow-hidden transition-all duration-700 cursor-pointer ${
          hoveredSide === 'boring' ? 'w-[60%]' : hoveredSide === 'chaos' ? 'w-[40%]' : ''
        }`}
        style={{
          background: hoveredSide === 'boring' ? '#f8f9fa' : 'white',
          color: '#333',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
        onMouseEnter={() => setHoveredSide('boring')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleChoice('boring')}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl font-semibold mb-4" style={{ color: '#007bff' }}>
            Are you an employer?
          </h2>
          <p className="text-xl mb-8 text-center max-w-md" style={{ color: '#666' }}>
            I have a professional portfolio with clean design, organized content, and a downloadable resume.
          </p>
          
          {/* Preview of boring site */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="h-4 bg-blue-500 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
            <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              View Professional Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Chaos Side */}
      <div 
        className={`w-1/2 h-full relative overflow-hidden transition-all duration-700 cursor-pointer ${
          hoveredSide === 'chaos' ? 'w-[60%]' : hoveredSide === 'boring' ? 'w-[40%]' : ''
        }`}
        style={{
          background: hoveredSide === 'chaos' 
            ? 'radial-gradient(circle at 50% 50%, #FF006E, #8B00FF, #000)' 
            : '#000',
          color: '#fff'
        }}
        onMouseEnter={() => setHoveredSide('chaos')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleChoice('chaos')}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <h2 
            className="text-4xl font-bold mb-4 animate-pulse"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              textShadow: hoveredSide === 'chaos' ? '0 0 20px #FF006E, 0 0 40px #8B00FF' : 'none',
              color: hoveredSide === 'chaos' ? '#00F5FF' : '#FF006E'
            }}
          >
            OR SOMEONE COOL?
          </h2>
          <p 
            className="text-xl mb-8 text-center max-w-md"
            style={{ 
              color: hoveredSide === 'chaos' ? '#FFBE0B' : '#00F5FF',
              textShadow: hoveredSide === 'chaos' ? '0 0 10px currentColor' : 'none'
            }}
          >
            WARNING: Contains experimental interfaces, impossible geometries, and may cause existential thoughts
          </p>
          
          {/* Preview of chaos site */}
          <div className="relative w-full max-w-md">
            {/* Glitch effect boxes */}
            <div 
              className="absolute inset-0 border-2 border-pink-500 transform rotate-1"
              style={{ 
                animation: hoveredSide === 'chaos' ? 'glitch 2s infinite' : 'none',
                boxShadow: '0 0 20px #FF006E'
              }}
            ></div>
            <div 
              className="absolute inset-0 border-2 border-cyan-500 transform -rotate-1"
              style={{ 
                animation: hoveredSide === 'chaos' ? 'glitch 2s infinite reverse' : 'none',
                boxShadow: '0 0 20px #00F5FF'
              }}
            ></div>
            
            <div className="relative p-6 backdrop-blur-md">
              <div className="space-y-4">
                <div 
                  className="h-8 rounded"
                  style={{
                    background: 'linear-gradient(90deg, #FF006E, #8B00FF, #00F5FF)',
                    animation: hoveredSide === 'chaos' ? 'pulse 2s infinite' : 'none'
                  }}
                ></div>
                <div className="flex gap-2">
                  <div className="h-20 w-20 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="h-20 w-20 bg-purple-500 rounded-full animate-spin"></div>
                  <div className="h-20 w-20 bg-cyan-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <button 
                className="mt-6 w-full py-3 text-lg font-bold relative overflow-hidden group"
                style={{
                  background: hoveredSide === 'chaos' 
                    ? 'linear-gradient(45deg, #FF006E, #8B00FF, #00F5FF)' 
                    : '#FF006E',
                  textShadow: '0 0 10px currentColor',
                  border: '2px solid transparent',
                  borderImage: 'linear-gradient(45deg, #FF006E, #00F5FF) 1',
                  animation: hoveredSide === 'chaos' ? 'rgbShift 3s infinite' : 'none'
                }}
              >
                <span className="relative z-10">ENTER THE CHAOS</span>
                <div 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ mixBlendMode: 'overlay' }}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated particles for chaos side */}
        {hoveredSide === 'chaos' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#FF006E', '#8B00FF', '#00F5FF', '#FFBE0B'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @keyframes rgbShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(10px) translateX(-10px); }
          75% { transform: translateY(-10px) translateX(20px); }
        }
      `}</style>
    </div>
    </>
  );
}