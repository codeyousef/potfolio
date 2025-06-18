'use client';

import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-text-secondary">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center"
          animate={{ 
            borderColor: ['#B8B8B8', '#00D9FF', '#B8B8B8']
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2"
            animate={{
              y: [0, 16, 0],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}