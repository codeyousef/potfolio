import React, { useRef, useEffect, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'notification' | 'floating';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  children,
  className = '',
  animate = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add dynamic light reflection based on cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      cardRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(255, 255, 255, 0.1) 0%, 
          transparent 60%),
        ${getBaseBackground(variant)}
      `;
    };
    
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      
      // Store the base background for reset
      card.dataset.baseBackground = getBaseBackground(variant);
      
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [variant]);
  
  // Get base background based on variant
  const getBaseBackground = (variant: string): string => {
    switch (variant) {
      case 'notification':
        return 'var(--glass-black)';
      case 'floating':
        return 'linear-gradient(135deg, var(--glass-teal), var(--glass-black))';
      default:
        return 'linear-gradient(135deg, var(--glass-teal) 0%, transparent 40%), linear-gradient(225deg, var(--glass-maroon) 0%, transparent 40%), radial-gradient(ellipse at top, var(--glass-navy), transparent 50%)';
    }
  };
  
  // Get class based on variant
  const getVariantClass = (variant: string): string => {
    switch (variant) {
      case 'notification':
        return 'notification-glass';
      case 'floating':
        return 'floating-control';
      default:
        return 'liquid-glass rounded-xl p-6';
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`
        ${getVariantClass(variant)}
        ${className}
      `}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;