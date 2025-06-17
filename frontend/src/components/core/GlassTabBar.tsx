import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassTabBarProps {
  items: TabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
  position?: 'bottom' | 'top';
  shrinkOnScroll?: boolean;
}

const GlassTabBar: React.FC<GlassTabBarProps> = ({
  items,
  activeId,
  onChange,
  className = '',
  position = 'bottom',
  shrinkOnScroll = true,
}) => {
  const [activeTab, setActiveTab] = useState(activeId || items[0]?.id);
  const [isScrolled, setIsScrolled] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    if (!shrinkOnScroll) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shrinkOnScroll]);
  
  // Update active tab when activeId prop changes
  useEffect(() => {
    if (activeId) {
      setActiveTab(activeId);
    }
  }, [activeId]);
  
  // Add dynamic light reflection based on cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tabBarRef.current) return;
      
      const rect = tabBarRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      tabBarRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(255, 255, 255, 0.1) 0%, 
          transparent 60%),
        var(--glass-black)
      `;
    };
    
    const tabBar = tabBarRef.current;
    if (tabBar) {
      tabBar.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        tabBar.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);
  
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (onChange) {
      onChange(id);
    }
  };
  
  return (
    <motion.div
      ref={tabBarRef}
      className={`
        tab-bar
        ${isScrolled ? 'scrolled' : ''}
        ${position === 'top' ? 'top-20' : 'bottom-6'}
        left-1/2 transform -translate-x-1/2
        z-40
        ${className}
      `}
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, delay: 0.2 }
      }}
    >
      {items.map((item) => (
        <motion.button
          key={item.id}
          className={`
            relative px-4 py-2 rounded-full
            transition-all duration-300 ease-out
            ${activeTab === item.id 
              ? 'text-white border border-teal-accent/40 shadow-[0_0_20px_rgba(56,178,172,0.3)]' 
              : 'text-gray-300 hover:text-white hover:border-teal-accent/20 hover:shadow-[0_0_10px_rgba(56,178,172,0.1)]'}
          `}
          onClick={() => handleTabChange(item.id)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-2">
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default GlassTabBar;