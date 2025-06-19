import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Tech {
  name: string;
  level: number;
  experience: string;
  projects: number | string;
}

interface SkillOrbProps {
  tech: Tech;
  index: number;
  total: number;
  color: string;
}

export default function SkillOrb({ tech, index, total, color }: SkillOrbProps) {
  const orbRef = useRef<THREE.Group>(null);
  const plasmaRef = useRef<THREE.Mesh>(null);
  
  // Calculate orbital position
  const angle = (index / total) * Math.PI * 2;
  const radius = 4;
  const position: [number, number, number] = [
    Math.cos(angle) * radius,
    Math.sin(index * 0.5) * 0.5,
    Math.sin(angle) * radius
  ];

  // Create plasma shader material
  const plasmaMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        level: { value: tech.level / 100 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float level;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Plasma effect
          float plasma = sin(vPosition.x * 10.0 + time) * 0.5 + 0.5;
          plasma += sin(vPosition.y * 10.0 + time * 1.1) * 0.5 + 0.5;
          plasma += sin(length(vPosition.xy) * 10.0 - time * 1.2) * 0.5 + 0.5;
          plasma /= 3.0;
          
          // Skill level affects intensity
          vec3 finalColor = mix(color * 0.3, color, plasma * level);
          
          // Edge glow
          float edge = 1.0 - abs(length(vUv - 0.5) - 0.4) * 10.0;
          edge = clamp(edge, 0.0, 1.0);
          
          gl_FragColor = vec4(finalColor, edge * 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    return material;
  }, [color, tech.level]);

  // Animation
  useFrame((state) => {
    if (orbRef.current) {
      // Orbital motion
      const time = state.clock.elapsedTime;
      orbRef.current.position.x = Math.cos(angle + time * 0.2) * radius;
      orbRef.current.position.z = Math.sin(angle + time * 0.2) * radius;
      orbRef.current.position.y = Math.sin(time * 0.5 + index) * 0.5;
      
      // Rotation
      orbRef.current.rotation.x += 0.01;
      orbRef.current.rotation.y += 0.02;
    }
    
    if (plasmaRef.current && plasmaMaterial) {
      // Update shader time
      plasmaMaterial.uniforms.time.value = state.clock.elapsedTime * 2;
    }
  });

  const orbSize = 0.3 + (tech.level / 100) * 0.2;

  return (
    <group ref={orbRef} position={position}>
      {/* Plasma sphere */}
      <mesh ref={plasmaRef} material={plasmaMaterial}>
        <sphereGeometry args={[orbSize, 32, 32]} />
      </mesh>
      
      {/* Inner glow */}
      <mesh scale={0.9}>
        <sphereGeometry args={[orbSize, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer aura */}
      <mesh scale={1.5}>
        <sphereGeometry args={[orbSize, 8, 8]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Tech name label */}
      <Text
        position={[0, orbSize + 0.3, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {tech.name}
      </Text>
      
      {/* Level indicator */}
      <Text
        position={[0, -orbSize - 0.3, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {tech.level}%
      </Text>
      
      {/* Energy particles */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}