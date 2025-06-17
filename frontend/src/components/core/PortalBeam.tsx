import React from 'react';

interface PortalBeamProps {
  intensity?: number;
  className?: string;
}

const PortalBeam: React.FC<PortalBeamProps> = ({ 
  intensity = 1, 
  className = '' 
}) => {
  return (
    <div className={`portal-beam ${className}`}>
      {/* Core beam: Clean bright line */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '4px',
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 80%, #00D4FF 100%)',
          transform: 'translateX(-50%)',
          animation: 'portal-pulse 2s ease-in-out infinite',
          opacity: intensity,
        }}
      />
      
      {/* Expanding base foundation - smooth gradient */}
      <div 
        className="absolute left-1/2 bottom-0"
        style={{
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse 300px 150px at center top, #FFFFFF 0%, #00D4FF 20%, #38B2AC 40%, transparent 70%)',
          transform: 'translateX(-50%)',
          animation: 'base-pulse 3s ease-in-out infinite',
          opacity: intensity * 0.6,
        }}
      />
      
      {/* Inner glow: Smooth expansion */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '40px',
          background: 'linear-gradient(to bottom, #00D4FF 0%, #00D4FF 60%, #38B2AC 100%)',
          transform: 'translateX(-50%) scaleX(1) scaleY(1)',
          filter: 'blur(20px)',
          animation: 'beam-expand 2.5s ease-in-out infinite 0.3s',
          opacity: intensity * 0.7,
        }}
      />
      
      {/* Middle glow: Wider smooth expansion */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '120px',
          background: 'linear-gradient(to bottom, #38B2AC 0%, #38B2AC 50%, #00D4FF 100%)',
          transform: 'translateX(-50%) scaleX(1) scaleY(1)',
          filter: 'blur(60px)',
          animation: 'beam-expand 3s ease-in-out infinite 0.6s',
          opacity: intensity * 0.5,
        }}
      />
      
      {/* Outer glow: Environmental lighting */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '300px',
          background: 'linear-gradient(to bottom, #1e3a8a 0%, #38B2AC 30%, #00D4FF 60%, rgba(255,255,255,0.3) 100%)',
          transform: 'translateX(-50%) scaleX(1) scaleY(1)',
          filter: 'blur(120px)',
          animation: 'beam-expand 4s ease-in-out infinite 1s',
          opacity: intensity * 0.3,
        }}
      />
      
      {/* Ultra-wide environmental glow */}
      <div 
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: '800px',
          background: 'linear-gradient(to bottom, transparent 0%, #1e3a8a 20%, #38B2AC 50%, #00D4FF 70%, transparent 100%)',
          transform: 'translateX(-50%)',
          filter: 'blur(200px)',
          animation: 'portal-pulse 5s ease-in-out infinite 1.5s',
          opacity: intensity * 0.15,
        }}
      />
      
      <style>{`
        .portal-beam {
          position: fixed;
          left: 50%;
          top: 0;
          height: 100vh;
          width: 800px;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 1;
        }
        
        @keyframes portal-pulse {
          0%, 100% { 
            opacity: 0.8;
            transform: translateX(-50%);
          }
          50% { 
            opacity: 1;
            transform: translateX(-50%);
          }
        }
        
        @keyframes beam-expand {
          0%, 100% { 
            transform: translateX(-50%) scaleX(1) scaleY(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateX(-50%) scaleX(1.5) scaleY(1.02);
            opacity: 0.9;
          }
        }
        
        @keyframes base-pulse {
          0%, 100% { 
            opacity: 0.5;
            transform: translateX(-50%) scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: translateX(-50%) scale(1.2);
          }
        }
        
        /* Subtle energy flow effect */
        .portal-beam::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            #FFFFFF 10%,
            #00D4FF 30%,
            #FFFFFF 50%,
            #38B2AC 70%,
            #00D4FF 90%,
            transparent 100%
          );
          transform: translateX(-50%);
          animation: energy-flow 2s linear infinite;
          filter: blur(0.5px);
          opacity: 0.8;
        }
        
        @keyframes energy-flow {
          0% { 
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          20% { 
            opacity: 1;
          }
          80% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PortalBeam;