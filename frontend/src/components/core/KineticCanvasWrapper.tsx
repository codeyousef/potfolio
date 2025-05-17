import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useAethelframeStore } from '../../store/useAethelframeStore';

interface KineticCanvasWrapperProps {
  children: ReactNode;
  id: string;
}

const KineticCanvasWrapper = ({ children, id }: KineticCanvasWrapperProps) => {
  const { currentPhase } = useAethelframeStore();
  
  // Different transition settings based on the current phase
  const getTransition = () => {
    switch(currentPhase) {
      case 'seed':
        return { duration: 1.2, ease: [0.76, 0, 0.24, 1] };
      case 'growth':
        return { duration: 0.9, ease: [0.76, 0, 0.24, 1] };
      case 'bloom':
        return { duration: 0.7, ease: [0.76, 0, 0.24, 1] };
      default:
        return { duration: 0.9, ease: [0.76, 0, 0.24, 1] };
    }
  };
  
  const variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      rotateY: 5,
      translateZ: -50,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      translateZ: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      rotateY: -5,
      translateZ: -50,
    }
  };
  
  return (
    <motion.section
      className="kinetic-canvas perspective"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={getTransition()}
      data-canvas-id={id}
    >
      {children}
    </motion.section>
  );
};

export default KineticCanvasWrapper;