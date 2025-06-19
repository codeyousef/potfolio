'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingSequence({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            onComplete?.();
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--void)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Ultra minimal loader */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                width: '128px',
                height: '1px',
                backgroundColor: 'var(--graphite)'
              }}
            >
              <motion.div 
                style={{
                  height: '100%',
                  backgroundColor: 'var(--light)',
                  transformOrigin: 'left'
                }}
                animate={{ 
                  scaleX: progress / 100 
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: 'linear' 
                }}
              />
            </div>
            
            {/* No percentage. No text. Just the line. */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}