import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HolographicControlPanelProps {
  children?: React.ReactNode;
  title?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onInteract?: () => void;
}

const HolographicControlPanel: React.FC<HolographicControlPanelProps> = ({
  children,
  title,
  width = 300,
  height = 'auto',
  color = '#38B2AC',
  className = '',
  style = {},
  onInteract,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse position for ripple effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // Handle interaction
  const handleInteraction = () => {
    if (onInteract) onInteract();
  };
  
  // Convert hex color to RGB for CSS
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgbColor = hexToRgb(color);
  
  // Animation variants
  const panelVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    hover: { 
      scale: 1.02,
      boxShadow: `0 0 20px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`,
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      boxShadow: `0 0 30px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)`,
      transition: { duration: 0.1 }
    }
  };
  
  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (panelRef.current) {
        const scanlines = panelRef.current.querySelectorAll('.holographic-scanline');
        scanlines.forEach((line, index) => {
          (line as HTMLElement).style.top = `${(index * 4 + Date.now() / 50) % 100}%`;
        });
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      ref={panelRef}
      className={`holographic-control-panel ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        ...style,
      }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={panelVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseMove={handleMouseMove}
      onClick={handleInteraction}
    >
      {/* Transparent holographic outline */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          border: `1px solid rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${isHovered ? 0.6 : 0.3})`,
          background: 'transparent',
          backdropFilter: 'blur(0.5px) brightness(1.05)',
          boxShadow: `
            inset 0 0 20px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.02),
            0 0 40px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${isHovered ? 0.15 : 0.05})
          `,
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* Scanline pattern */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="holographic-scanline absolute left-0 w-full h-px"
            style={{
              background: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.06)`,
              top: `${(i * 6) % 100}%`,
              opacity: isHovered ? 0.4 : 0.15,
              transition: 'opacity 0.3s ease',
            }}
          />
        ))}
      </div>
      
      {/* Hexagonal cell pattern */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={`hex-pattern-${color.replace('#', '')}`}
              patternUnits="userSpaceOnUse"
              width="30"
              height="30"
              patternTransform="scale(0.5) rotate(0)"
            >
              <path
                d="M15 0 L30 10 L30 20 L15 30 L0 20 L0 10 Z"
                fill="none"
                stroke={`rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-pattern-${color.replace('#', '')})`} />
        </svg>
      </div>
      
      {/* Title bar */}
      {title && (
        <div 
          className="relative z-30 px-4 py-2 border-b border-opacity-20 flex items-center"
          style={{ borderColor: color }}
        >
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              animation: 'pulse 2s infinite ease-in-out'
            }}
          />
          <h3 
            className="text-sm font-medium tracking-wider uppercase"
            style={{ 
              color: 'white',
              textShadow: `0 0 5px ${color}`,
              letterSpacing: '0.1em'
            }}
          >
            {title}
          </h3>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-30 p-4">
        {children}
      </div>
      
      {/* Ripple effect on click */}
      {isPressed && (
        <motion.div
          className="absolute z-40 rounded-full pointer-events-none"
          style={{
            top: mousePosition.y,
            left: mousePosition.x,
            backgroundColor: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ 
            width: 300, 
            height: 300, 
            opacity: 0,
            transition: { duration: 0.8 }
          }}
        />
      )}
      
      {/* Neon text effect styles */}
      <style>{`
        .holographic-control-panel {
          font-family: 'JetBrains Mono', monospace;
          color: white;
        }
        
        .holographic-control-panel input,
        .holographic-control-panel button,
        .holographic-control-panel select,
        .holographic-control-panel textarea {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.3s ease;
        }
        
        .holographic-control-panel input:focus,
        .holographic-control-panel button:hover,
        .holographic-control-panel select:focus,
        .holographic-control-panel textarea:focus {
          border-color: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8);
          box-shadow: 0 0 10px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3);
          outline: none;
        }
        
        .holographic-control-panel button {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.9em;
          font-weight: 500;
        }
        
        .holographic-control-panel button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2),
            transparent
          );
          transition: 0.5s;
        }
        
        .holographic-control-panel button:hover::before {
          left: 100%;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};

// Holographic form elements
export const HolographicInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ 
  label, 
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs uppercase tracking-wider mb-1 opacity-80">
          {label}
        </label>
      )}
      <input 
        {...props} 
        className={`w-full bg-transparent ${props.className || ''}`}
      />
    </div>
  );
};

export const HolographicButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <button 
      {...props} 
      className={`px-4 py-2 ${props.className || ''}`}
    >
      {children}
    </button>
  );
};

export const HolographicSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { 
  label?: string;
  options: Array<{ value: string; label: string }>;
}> = ({ 
  label, 
  options,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs uppercase tracking-wider mb-1 opacity-80">
          {label}
        </label>
      )}
      <select 
        {...props} 
        className={`w-full bg-transparent ${props.className || ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const HolographicCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { 
  label: string;
}> = ({ 
  label, 
  ...props 
}) => {
  const [checked, setChecked] = useState(props.checked || false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (props.onChange) props.onChange(e);
  };
  
  return (
    <label className="flex items-center mb-4 cursor-pointer">
      <div className="relative mr-2">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked}
          onChange={handleChange}
          {...props} 
        />
        <div 
          className={`w-5 h-5 border rounded-full transition-all duration-300 ${
            checked ? 'bg-teal-500 border-teal-500' : 'bg-transparent border-gray-500'
          }`}
        >
          {checked && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.div>
          )}
        </div>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
};

export const HolographicSlider: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { 
  label?: string;
  color?: string;
}> = ({ 
  label, 
  color = '#38B2AC',
  ...props 
}) => {
  const [value, setValue] = useState(props.value || props.defaultValue || 0);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (props.onChange) props.onChange(e);
  };
  
  // Convert hex color to RGB for CSS
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgbColor = hexToRgb(color);
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs uppercase tracking-wider mb-1 opacity-80">
          {label}
        </label>
      )}
      <div className="relative py-2">
        <input 
          type="range" 
          className="w-full appearance-none bg-transparent"
          value={value}
          onChange={handleChange}
          {...props} 
          style={{
            // Remove default styling
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
            // Custom track
            background: `linear-gradient(to right, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8) 0%, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8) ${Number(value) / (Number(props.max) || 100) * 100}%, 
              rgba(255, 255, 255, 0.2) ${Number(value) / (Number(props.max) || 100) * 100}%, 
              rgba(255, 255, 255, 0.2) 100%)`,
            height: '2px',
            borderRadius: '2px',
          }}
        />
        {/* Custom thumb */}
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 10px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          
          input[type=range]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 10px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8);
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
          }
          
          input[type=range]::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
        `}</style>
        
        {/* Lightning arc effect */}
        <div 
          className="absolute top-1/2 left-0 w-full h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1) 0%,
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3) 50%,
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1) 100%
            )`,
            boxShadow: `0 0 5px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)`,
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    </div>
  );
};

export default HolographicControlPanel;