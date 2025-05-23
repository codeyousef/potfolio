import { motion } from 'framer-motion';
import { useEffect, useState, memo } from 'react';
import { useAethelframeStore } from '../../store/useAethelframeStore';

const Overture = memo(() => {
  const { hideOverture } = useAethelframeStore();
  const [showSkip, setShowSkip] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('aethelframe_visited');
    console.log('Overture: checking if user has visited before, aethelframe_visited =', visited);

    if (visited) {
      console.log('Overture: user has visited before, setting hasVisited to true');
      setHasVisited(true);
    } else {
      console.log('Overture: user has not visited before');
    }

    // Show skip button after delay
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleBegin = () => {
    console.log('Overture: handleBegin called');
    console.log('Overture: setting aethelframe_visited to true');
    localStorage.setItem('aethelframe_visited', 'true');
    console.log('Overture: calling hideOverture()');
    hideOverture();
  };

  // Variants for animations
  const monolithVariants = {
    initial: { 
      scale: 0.9, 
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: [0.76, 0, 0.24, 1]
      } 
    }
  };

  const titleVariants = {
    initial: { 
      y: 20, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.76, 0, 0.24, 1],
        delay: 0.8
      } 
    }
  };

  const promptVariants = {
    initial: { 
      y: 15, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: [0.76, 0, 0.24, 1],
        delay: 1.5
      } 
    }
  };

  const skipVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8 } 
    }
  };

  // If user has visited before, skip overture automatically after a short delay
  useEffect(() => {
    console.log('Overture: hasVisited useEffect triggered, hasVisited =', hasVisited);

    if (hasVisited) {
      console.log('Overture: user has visited before, setting timer to hide overture');

      const timer = setTimeout(() => {
        console.log('Overture: timer expired, calling hideOverture()');
        hideOverture();
      }, 500);

      return () => {
        console.log('Overture: cleaning up timer');
        clearTimeout(timer);
      };
    } else {
      console.log('Overture: user has not visited before, not hiding overture');
    }
  }, [hasVisited, hideOverture]);

  if (hasVisited) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-dark-bg z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-montserrat font-light tracking-wider text-highlight-color"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            AETHELFRAME
          </motion.h1>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-bg z-50">
      <div className="noise-overlay"></div>

      <motion.div 
        className="w-24 h-48 md:w-36 md:h-72 bg-highlight-color/10 border border-highlight-color/20 mb-8"
        variants={monolithVariants}
        initial="initial"
        animate="animate"
      />

      <motion.h1 
        className="text-4xl md:text-5xl font-montserrat font-light tracking-wider text-highlight-color mb-10"
        variants={titleVariants}
        initial="initial"
        animate="animate"
      >
        AETHELFRAME
      </motion.h1>

      <motion.div
        variants={promptVariants}
        initial="initial"
        animate="animate"
      >
        <motion.button
          className="begin-prompt"
          onClick={handleBegin}
          whileHover={{ 
            letterSpacing: "0.2em",
            textShadow: "0 0 8px rgba(226, 200, 160, 0.7)" 
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            scale: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2,
              ease: "easeInOut"
            }
          }}
        >
          [ BEGIN ]
        </motion.button>
      </motion.div>

      {showSkip && (
        <motion.button
          className="absolute bottom-8 text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
          onClick={handleBegin}
          variants={skipVariants}
          initial="initial"
          animate="animate"
        >
          Skip Overture
        </motion.button>
      )}
    </div>
  );
});

export default Overture;
