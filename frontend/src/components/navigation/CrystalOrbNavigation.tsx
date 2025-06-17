import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
}

interface CrystalOrbNavigationProps {
  items: NavItem[];
  portalPosition?: { x: number; y: number };
  radius?: number;
}

const CrystalOrbNavigation: React.FC<CrystalOrbNavigationProps> = ({
  items,
  portalPosition = { x: 50, y: 50 },
  radius = 200,
}) => {
  const [hoveredOrb, setHoveredOrb] = useState<string | null>(null);
  const [activeOrb, setActiveOrb] = useState<string | null>(null);
  
  
  const handleOrbClick = (item: NavItem) => {
    console.log('Crystal orb clicked:', item.id);
    setActiveOrb(item.id);
    item.onClick();
    
    // Create lightning bolt effect to portal
    setTimeout(() => setActiveOrb(null), 1000);
  };
  
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 60, 
      display: 'flex', 
      gap: '12px',
      padding: '8px'
    }}>
      {items.map((item, index) => {
        const isHovered = hoveredOrb === item.id;
        const isActive = activeOrb === item.id;
        
        return (
          <motion.div
            key={item.id}
            className="crystal-orb"
            style={{
              position: 'relative', // Changed from fixed to relative since parent handles positioning
              pointerEvents: 'auto',
            }}
            animate={{
              scale: isHovered ? 1.3 : 1,
              rotate: isHovered ? 360 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              rotate: { duration: 2, ease: 'easeInOut' }
            }}
            onHoverStart={() => setHoveredOrb(item.id)}
            onHoverEnd={() => setHoveredOrb(null)}
            onClick={() => handleOrbClick(item)}
          >
            {/* Main orb structure */}
            <div 
              className="orb-container"
              style={{
                width: '50px',
                height: '50px',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Visible orb */}
              <div
                className="visible-orb"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(56, 178, 172, 0.8)',
                  border: '2px solid #FFFFFF',
                  boxShadow: `
                    0 0 20px rgba(56, 178, 172, ${isHovered ? 1 : 0.6}),
                    inset 0 0 10px rgba(255, 255, 255, 0.3)
                  `,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
                    fontWeight: 'bold',
                  }}
                >
                  {item.icon}
                </span>
              </div>
              
              {/* Floating label on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(56, 178, 172, 0.4)',
                    boxShadow: '0 0 15px rgba(56, 178, 172, 0.3)',
                  }}
                >
                  {item.label}
                </motion.div>
              )}
              
              {/* Lightning bolt effect - temporarily disabled to fix error */}
              {/* {isActive && (
                <div className="lightning-bolt">Lightning effect</div>
              )} */}
              
              {/* Orbital ring around orb */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '80px',
                  height: '80px',
                  transform: 'translate(-50%, -50%)',
                  border: '1px solid rgba(56, 178, 172, 0.2)',
                  borderRadius: '50%',
                  animation: isHovered ? 'orbit-spin 3s linear infinite' : 'orbit-spin 10s linear infinite',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </motion.div>
        );
      })}
      
      <style>{`
        @keyframes orbit-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        .crystal-orb {
          filter: drop-shadow(0 0 20px rgba(56, 178, 172, 0.3));
        }
        
        .crystal-orb:hover {
          filter: drop-shadow(0 0 30px rgba(56, 178, 172, 0.6));
        }
      `}</style>
    </div>
  );
};

export default CrystalOrbNavigation;