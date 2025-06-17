import React from 'react';
import { motion } from 'framer-motion';

interface GlassIconProps {
  icon: React.ReactNode;
  variant?: 'teal' | 'maroon' | 'navy' | 'multi';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const GlassIcon: React.FC<GlassIconProps> = ({
  icon,
  variant = 'multi',
  size = 'md',
  className = '',
  animate = true,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  // Get background based on variant
  const getBackground = (variant: string): string => {
    switch (variant) {
      case 'teal':
        return 'bg-teal-accent';
      case 'maroon':
        return 'bg-maroon-accent';
      case 'navy':
        return 'bg-navy-accent';
      case 'multi':
      default:
        return 'bg-gradient-conic from-teal-accent via-navy-accent to-maroon-accent';
    }
  };
  
  return (
    <motion.div
      className={`
        relative ${sizeClasses[size]} ${className}
      `}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animate ? { 
        opacity: 0.9, 
        scale: 1,
        transition: { duration: 0.5 }
      } : undefined}
      whileHover={{ 
        scale: 1.1, 
        opacity: 1,
        transition: { duration: 0.2 }
      }}
    >
      {/* Glass background with blur effect */}
      <div 
        className={`
          absolute inset-0 
          ${getBackground(variant)}
          opacity-90 
          blur-[0.5px]
          rounded-full
        `}
      />
      
      {/* Icon container */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {icon}
      </div>
    </motion.div>
  );
};

export default GlassIcon;