import React, { useRef, useEffect, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add dynamic light reflection based on cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      let gradientColor = 'rgba(255, 255, 255, 0.15)';
      if (variant === 'primary') gradientColor = 'rgba(56, 178, 172, 0.2)';
      if (variant === 'secondary') gradientColor = 'rgba(44, 82, 130, 0.2)';
      if (variant === 'accent') gradientColor = 'rgba(155, 44, 44, 0.2)';
      
      buttonRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          ${gradientColor} 0%, 
          transparent 60%),
        ${getBaseBackground(variant)}
      `;
    };
    
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('mousemove', handleMouseMove);
      
      // Store the base background for reset
      button.dataset.baseBackground = getBaseBackground(variant);
      
      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [variant]);
  
  // Get base background based on variant
  const getBaseBackground = (variant: string): string => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, var(--glass-teal), var(--glass-black))';
      case 'secondary':
        return 'linear-gradient(135deg, var(--glass-navy), var(--glass-black))';
      case 'accent':
        return 'linear-gradient(135deg, var(--glass-maroon), var(--glass-black))';
      default:
        return 'var(--glass-black)';
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-3 px-5',
    lg: 'text-base py-4 px-7',
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`
        glass-button
        ${sizeClasses[size]}
        focus:outline-none focus:ring-2 focus:ring-teal-accent/50
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3 }
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlassButton;