import React from 'react';
import { motion } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';

interface ArabicCalligraphyElementProps {
  className?: string;
}

const ArabicCalligraphyElement: React.FC<ArabicCalligraphyElementProps> = ({ className = '' }) => {
  const { currentPhase } = useAethelframeStore();

  // Different animation variants based on the current phase
  const getVariants = () => {
    switch(currentPhase) {
      case 'seed':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 0.2, 
            scale: 1,
            transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
          }
        };
      case 'growth':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { 
            opacity: 0.5, 
            scale: 1,
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }
        };
      case 'bloom':
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { 
            opacity: 0.7, 
            scale: 1,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.span 
      className={`arabic-element ${className}`}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <motion.path
          d="M10,20 Q30,5 50,20 T90,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            transition: { 
              duration: 1.5, 
              ease: "easeInOut",
              delay: 0.2
            }
          }}
        />
        <motion.path
          d="M10,25 Q30,40 50,25 T90,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            transition: { 
              duration: 1.5, 
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        />
        <motion.circle 
          cx="50" 
          cy="22.5" 
          r="2" 
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            transition: { 
              duration: 0.5, 
              ease: "backOut",
              delay: 1.2
            }
          }}
        />
      </svg>
    </motion.span>
  );
};

export default ArabicCalligraphyElement;
