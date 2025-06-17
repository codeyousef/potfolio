import React, { useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface LiquidGlassShardProps {
  children: React.ReactNode;
  size?: [number, number];
  depth?: number;
  color?: string;
  portalProximity?: number;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Advanced Liquid Glass DOM Component
export const LiquidGlassShardDOM: React.FC<LiquidGlassShardProps> = ({
  children,
  size = [300, 200],
  depth = 20,
  color = '#38B2AC',
  portalProximity = 0.5,
  interactive = true,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);  
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgbColor = hexToRgb(color);
  
  // Generate asymmetric crystalline shape
  const generateAsymmetricShape = () => {
    const points = [];
    const numPoints = 8 + Math.floor(Math.random() * 4); // 8-11 points for complex shapes
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const baseRadius = 35;
      const radiusVariation = 25 + Math.random() * 30;
      const angleOffset = (Math.random() - 0.5) * 0.8;
      
      const x = 50 + Math.cos(angle + angleOffset) * (baseRadius + radiusVariation);
      const y = 50 + Math.sin(angle + angleOffset) * (baseRadius + radiusVariation);
      
      points.push(`${Math.max(3, Math.min(97, x))}% ${Math.max(3, Math.min(97, y))}%`);
    }
    
    return `polygon(${points.join(', ')})`;
  };
  
  const clipPath = useMemo(() => generateAsymmetricShape(), []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  
  // Liquid glass styles with advanced effects
  const getAdvancedGlassStyles = (): React.CSSProperties => {
    const proximityIntensity = 0.3 + portalProximity * 0.7;
    const hoverMultiplier = isHovered ? 1.5 : 1;
    
    return {
      width: size[0],
      height: size[1],
      position: 'relative',
      clipPath,
      transform: `
        translateZ(${depth}px) 
        rotateX(${Math.random() * 4 - 2}deg) 
        rotateY(${Math.random() * 4 - 2}deg)
        ${isHovered ? 'scale(1.03) translateY(-8px)' : ''}
      `,
      transformStyle: 'preserve-3d',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'liquid-float 8s ease-in-out infinite',
      animationDelay: `${Math.random() * 3}s`,
      filter: `
        brightness(${1 + proximityIntensity * 0.2 * hoverMultiplier})
        contrast(${1 + proximityIntensity * 0.1 * hoverMultiplier})
        saturate(${1 + proximityIntensity * 0.3 * hoverMultiplier})
      `,
      ...style,
    };
  };
  
  return (
    <motion.div
      className={`liquid-glass-shard ${className}`}
      style={getAdvancedGlassStyles()}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Outer Shell: 5% opacity with chromatic aberration */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.05)`,
          backdropFilter: 'blur(3px) brightness(1.08) contrast(1.05) saturate(1.1)',
          WebkitBackdropFilter: 'blur(3px) brightness(1.08) contrast(1.05) saturate(1.1)',
          border: `1px solid rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.25)`,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: `
            inset 0 0 40px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.08),
            inset 0 0 80px rgba(255, 255, 255, 0.02),
            0 0 60px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.15 + portalProximity * 0.2}),
            0 20px 40px rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* Chromatic Aberration */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(255, 0, 0, 0.03) 0%, transparent 60%),
              radial-gradient(circle at ${(mousePosition.x + 10) % 100}% ${(mousePosition.y + 10) % 100}%, 
                rgba(0, 255, 255, 0.03) 0%, transparent 60%),
              radial-gradient(circle at ${(mousePosition.x - 10) % 100}% ${(mousePosition.y - 10) % 100}%, 
                rgba(0, 255, 0, 0.02) 0%, transparent 60%)
            `,
            mixBlendMode: 'overlay',
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        {/* Beveled Edges */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 30%),
              linear-gradient(225deg, rgba(255, 255, 255, 0.15) 0%, transparent 25%),
              linear-gradient(315deg, rgba(255, 255, 255, 0.1) 0%, transparent 20%)
            `,
            borderRadius: '12px',
            opacity: 0.6,
          }}
        />
      </div>
      
      {/* Inner Core: Dynamic gradient following portal colors */}
      <div 
        className="absolute inset-3 z-15"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x * 0.8}% ${mousePosition.y * 0.8}%, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.15) 0%,
              rgba(240, 249, 255, 0.1) 25%,
              rgba(56, 178, 172, 0.08) 50%,
              rgba(44, 82, 130, 0.06) 75%,
              transparent 100%)
          `,
          borderRadius: '8px',
          mixBlendMode: 'overlay',
          opacity: 0.7 + portalProximity * 0.3,
          transition: 'opacity 0.4s ease',
        }}
      />
      
      {/* Edge Lighting: Bright rim light that pulses with user proximity */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          borderRadius: '12px',
          background: `
            linear-gradient(90deg, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.1 + portalProximity * 0.2}) 0%,
              transparent 50%,
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.1 + portalProximity * 0.2}) 100%),
            linear-gradient(0deg, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.1 + portalProximity * 0.2}) 0%,
              transparent 50%,
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.1 + portalProximity * 0.2}) 100%)
          `,
          boxShadow: `
            inset 0 0 0 1px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.4 + portalProximity * 0.4}),
            inset 0 0 20px rgba(255, 255, 255, ${0.1 + portalProximity * 0.2}),
            0 0 ${20 + portalProximity * 40}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.3 + portalProximity * 0.5})
          `,
          animation: `edge-pulse-${Math.floor(portalProximity * 3) + 3}s ease-in-out infinite`,
        }}
      />
      
      {/* Interactive Light Response */}
      {isHovered && (
        <motion.div
          className="absolute z-25 rounded-full pointer-events-none"
          style={{
            top: `${mousePosition.y}%`,
            left: `${mousePosition.x}%`,
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, 
              rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.4) 0%, 
              rgba(255, 255, 255, 0.2) 30%, 
              transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'overlay',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content Container */}
      <div className="relative z-30 h-full p-6">
        <div 
          style={{
            color: '#ffffff',
            textShadow: `
              0 0 15px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8),
              0 0 30px rgba(255, 255, 255, 0.3),
              0 1px 3px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {children}
        </div>
      </div>
      
      {/* Liquid Glass Animation Styles */}
      <style>{`
        @keyframes liquid-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotateZ(0deg) scale(1);
          }
          16% { 
            transform: translateY(-15px) translateX(5px) rotateZ(1deg) scale(1.002);
          }
          33% { 
            transform: translateY(-8px) translateX(-3px) rotateZ(-0.5deg) scale(0.998);
          }
          50% { 
            transform: translateY(-20px) translateX(2px) rotateZ(0.8deg) scale(1.003);
          }
          66% { 
            transform: translateY(-5px) translateX(-4px) rotateZ(-0.3deg) scale(0.999);
          }
          83% { 
            transform: translateY(-12px) translateX(3px) rotateZ(0.4deg) scale(1.001);
          }
        }
        
        @keyframes edge-pulse-3s {
          0%, 100% { filter: brightness(0.9) saturate(0.9) hue-rotate(0deg); }
          50% { filter: brightness(1.4) saturate(1.5) hue-rotate(5deg); }
        }
        
        @keyframes edge-pulse-4s {
          0%, 100% { filter: brightness(0.8) saturate(0.8) hue-rotate(0deg); }
          50% { filter: brightness(1.5) saturate(1.6) hue-rotate(-3deg); }
        }
        
        @keyframes edge-pulse-5s {
          0%, 100% { filter: brightness(1) saturate(1) hue-rotate(0deg); }
          50% { filter: brightness(1.3) saturate(1.3) hue-rotate(2deg); }
        }
        
        .liquid-glass-shard {
          will-change: transform, filter;
          contain: layout style paint;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        /* Glass distortion effect */
        .liquid-glass-shard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='distort'%3E%3CfeTurbulence baseFrequency='0.02' numOctaves='3' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23distort)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: overlay;
        }
      `}</style>
    </motion.div>
  );
};

// Advanced 3D Liquid Glass Component for Three.js Canvas
interface LiquidGlass3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  color?: string;
  portalProximity?: number;
  interactive?: boolean;
}

export const LiquidGlass3D: React.FC<LiquidGlass3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 2, 0.3],
  color = '#38B2AC',
  portalProximity = 0.5,
  interactive = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Create asymmetric glass geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const numPoints = 8 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const baseRadius = size[0] * 0.4;
      const radiusVariation = baseRadius * (0.3 + Math.random() * 0.4);
      const angleOffset = (Math.random() - 0.5) * 0.3;
      
      const x = Math.cos(angle + angleOffset) * (baseRadius + radiusVariation);
      const y = Math.sin(angle + angleOffset) * (baseRadius + radiusVariation);
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    
    shape.closePath();
    
    const extrudeSettings = {
      depth: size[2],
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelSegments: 8,
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [size]);
  
  // Animate the 3D shard
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
      meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        geometry={geometry}
        onPointerOver={() => interactive && setHovered(true)}
        onPointerOut={() => interactive && setHovered(false)}
      >
        <MeshTransmissionMaterial
          backside
          backsideThickness={2}
          thickness={0.5}
          roughness={0.1}
          transmission={0.98}
          ior={1.4}
          chromaticAberration={0.8}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color={color}
          attenuationDistance={5}
          attenuationColor={color}
        />
      </mesh>
    </Float>
  );
};

export default LiquidGlassShardDOM;