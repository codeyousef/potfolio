import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAethelframeStore } from '@store/useAethelframeStore';

interface FloatingContentShardProps {
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  depth?: number;
  color?: string;
  portalProximity?: number; // 0-1, how close to portal (affects lighting)
  interactive?: boolean;
  className?: string;
}

// React component for DOM-based shards (used outside Canvas)
export const FloatingContentShardDOM: React.FC<Omit<FloatingContentShardProps, 'position' | 'rotation'> & {
  style?: React.CSSProperties;
}> = ({
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
  const { currentPhase } = useAethelframeStore();
  
  // Generate asymmetric glass fragments as per new.md specification
  const generateAsymmetricShape = () => {
    // Create irregular polygons with beveled edges (new.md spec)
    const points = [];
    const numPoints = 7 + Math.floor(Math.random() * 3); // 7-9 points for complex crystalline shapes
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      // Significant asymmetry for glass fragment effect
      const baseRadius = 35;
      const radiusVariation = 20 + Math.random() * 25;
      const angleOffset = (Math.random() - 0.5) * 0.6; // More dramatic offset
      
      const x = 50 + Math.cos(angle + angleOffset) * (baseRadius + radiusVariation);
      const y = 50 + Math.sin(angle + angleOffset) * (baseRadius + radiusVariation);
      
      // Clamp values to reasonable bounds
      points.push(`${Math.max(5, Math.min(95, x))}% ${Math.max(5, Math.min(95, y))}%`);
    }
    
    return `polygon(${points.join(', ')})`;
  };
  
  // Memoize asymmetric shape so it doesn't change on re-renders
  const clipPath = React.useMemo(() => generateAsymmetricShape(), []);
  
  // Convert hex to RGB for dynamic styling
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);  
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgbColor = hexToRgb(color);
  
  // Calculate glass fragment styles per new.md specification
  const getAsymmetricGlassStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: size[0],
      height: size[1],
      position: 'relative',
      overflow: 'visible', // Allow beveled edges to show
      clipPath,
      // Gentle bobbing motion as if suspended in liquid
      animation: 'float-gentle 6s ease-in-out infinite',
      animationDelay: `${Math.random() * 2}s`,
      transform: `translateZ(${depth}px) rotateX(${Math.random() * 6 - 3}deg) rotateY(${Math.random() * 6 - 3}deg)`,
      transformStyle: 'preserve-3d',
      ...style,
    };
    
    // Enhanced hover effect with proximity-based edge lighting
    if (isHovered && interactive) {
      return {
        ...baseStyles,
        transform: `translateY(-8px) scale(1.03) translateZ(${depth + 10}px)`,
        filter: 'brightness(1.1) contrast(1.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }
    
    return {
      ...baseStyles,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };
  
  // Animation variants for the content
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      className={`asymmetric-glass-fragment ${className}`}
      style={getAsymmetricGlassStyles()}
      initial="initial"
      animate="animate"
      whileHover={interactive ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Outer Shell: 5% opacity with chromatic aberration (new.md spec) */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.05)`,
          backdropFilter: 'blur(2px) brightness(1.05)',
          border: `2px solid rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`,
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Chromatic Aberration Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, rgba(255, 0, 0, 0.02) 0%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 255, 255, 0.02) 0%, transparent 25%),
              linear-gradient(90deg, rgba(0, 255, 0, 0.01) 0%, transparent 50%)
            `,
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Beveled Edge Lighting */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
              linear-gradient(225deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%)
            `,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      
      {/* Aurora glow core - very subtle */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.02 + portalProximity * 0.03}) 0%, 
              transparent 60%)
          `,
          opacity: isHovered ? 0.6 : 0.3,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Edge lighting - aurora rim light */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 0 1px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.2 + portalProximity * 0.3}),
            0 0 30px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.1 + portalProximity * 0.2})
          `,
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Content container with glass text effects */}
      <div className="relative z-30 h-full p-6 flex flex-col">
        <div 
          className="w-full h-full"
          style={{
            color: '#ffffff',
            textShadow: `
              0 0 10px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.5),
              0 0 20px rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          {children}
        </div>
      </div>
      
      {/* Asymmetric Glass Fragment Animation Styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotateZ(0deg) scale(1);
          }
          25% { 
            transform: translateY(-12px) translateX(4px) rotateZ(0.8deg) scale(1.005);
          }
          50% { 
            transform: translateY(-6px) translateX(-3px) rotateZ(-0.5deg) scale(0.995);
          }
          75% { 
            transform: translateY(-15px) translateX(2px) rotateZ(0.3deg) scale(1.002);
          }
        }
        
        .asymmetric-glass-fragment {
          will-change: transform, filter;
          contain: layout style paint;
        }
      `}</style>
    </motion.div>
  );
};

// Three.js component for 3D shards (used inside Canvas)
const FloatingContentShard3D: React.FC<FloatingContentShardProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 2],
  depth = 0.2,
  color = '#38B2AC',
  portalProximity = 0.5,
  interactive = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Convert hex color to THREE.Color
  const threeColor = new THREE.Color(color);
  
  // Handle hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);
  
  // Animation for the shard
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      // Subtle rotation
      meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.02;
      
      // Scale effect on hover
      if (hovered && interactive) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      
      // Pulse edge light based on portal proximity
      const edgeIntensity = 0.5 + Math.sin(state.clock.getElapsedTime()) * 0.2 * portalProximity;
      if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        meshRef.current.material.emissiveIntensity = edgeIntensity;
      }
    }
  });
  
  // Create a custom asymmetric crystalline geometry
  const createShardGeometry = () => {
    // Create a more complex geometry using ExtrudeGeometry for beveled edges
    const shape = new THREE.Shape();
    
    // Generate asymmetric polygon shape
    const numPoints = 6 + Math.floor(Math.random() * 2);
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const baseRadius = size[0] * 0.4;
      const radiusVariation = baseRadius * (0.3 + Math.random() * 0.4);
      const angleOffset = (Math.random() - 0.5) * 0.2;
      
      const x = Math.cos(angle + angleOffset) * (baseRadius + radiusVariation);
      const y = Math.sin(angle + angleOffset) * (baseRadius + radiusVariation);
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
      points.push({ x, y });
    }
    
    shape.closePath();
    
    // Extrude with beveled edges
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelSegments: 3,
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.computeVertexNormals();
    
    return geometry;
  };
  
  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      onClick={() => interactive && setClicked(!clicked)}
      onPointerOver={() => interactive && setHovered(true)}
      onPointerOut={() => interactive && setHovered(false)}
      geometry={createShardGeometry()}
    >
      <meshPhysicalMaterial
        color={threeColor}
        transparent
        opacity={0.1}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.2}
        transmission={0.95}
        thickness={depth}
        envMapIntensity={1}
        emissive={threeColor}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Default export is the DOM version for most use cases
export default FloatingContentShardDOM;

// Also export the 3D version for use in Canvas
export { FloatingContentShard3D };