import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface CareerNode {
  position: [number, number, number];
  label: string;
  color: string;
  scale: number;
}

interface ProbabilityCloudProps {
  quantumState: number;
}

const careerNodes: CareerNode[] = [
  { position: [0, 0, 0], label: 'CURRENT YOU', color: '#FFFFFF', scale: 1.2 },
  { position: [3, 1, -1], label: 'GOOGLE ENGINEER', color: '#FF006E', scale: 1 },
  { position: [-3, -1, 1], label: 'STARTUP FOUNDER', color: '#00F5FF', scale: 1 },
  { position: [1, -3, 0], label: 'DIGITAL ARTIST', color: '#FFE500', scale: 1 },
  { position: [-1, 3, -2], label: 'TECH INFLUENCER', color: '#A8FF00', scale: 1 },
  { position: [2, -2, 2], label: 'GAME DEVELOPER', color: '#FF006E', scale: 0.8 },
  { position: [-2, 2, -1], label: 'AI RESEARCHER', color: '#00F5FF', scale: 0.8 },
  { position: [0, 2, 3], label: 'EDUCATOR', color: '#FFE500', scale: 0.8 },
];

// Gaussian random for natural distribution
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export default function ProbabilityCloud({ quantumState }: ProbabilityCloudProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  
  // Quantum field shader
  const fieldShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      quantumState: { value: 0.5 },
      observerPosition: { value: new THREE.Vector3() }
    },
    vertexShader: `
      varying vec3 vPosition;
      varying float vDistance;
      uniform vec3 observerPosition;
      uniform float time;
      
      void main() {
        vPosition = position;
        vDistance = distance(position, observerPosition);
        
        // Quantum fluctuations
        vec3 pos = position;
        float fluctuation = sin(position.x * 10.0 + time) * 
                          cos(position.y * 10.0 + time) * 0.1;
        pos += normalize(position) * fluctuation;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (30.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.5);
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      varying float vDistance;
      uniform float time;
      uniform float quantumState;
      
      void main() {
        // Probability density visualization
        float probability = 1.0 / (1.0 + vDistance * 0.1);
        
        // Quantum interference pattern
        float interference = sin(vDistance * 20.0 - time * 5.0) * 0.5 + 0.5;
        
        // Color based on probability and state
        vec3 color = mix(
          vec3(1.0, 0.0, 0.5), // Collapsed state - pink
          vec3(0.0, 1.0, 1.0), // Superposition - cyan
          quantumState
        );
        
        color *= probability * interference;
        
        // Particle shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float d = length(coord);
        if (d > 0.5) discard;
        
        float alpha = (1.0 - d * 2.0) * probability * 0.6;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), []);

  // Create probability field particles
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Gaussian distribution for more realistic cloud
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.abs(gaussianRandom(0, 2.5));
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    
    return positions;
  }, []);

  // Career node connections
  const connections = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Connect central node to all others
    for (let i = 1; i < careerNodes.length; i++) {
      lines.push([
        new THREE.Vector3(...careerNodes[0].position),
        new THREE.Vector3(...careerNodes[i].position)
      ]);
    }
    
    // Add some cross-connections
    lines.push([
      new THREE.Vector3(...careerNodes[1].position),
      new THREE.Vector3(...careerNodes[2].position)
    ]);
    lines.push([
      new THREE.Vector3(...careerNodes[3].position),
      new THREE.Vector3(...careerNodes[4].position)
    ]);
    
    return lines;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
    
    if (particlesRef.current && fieldShader) {
      fieldShader.uniforms.time.value = time;
      fieldShader.uniforms.quantumState.value = quantumState;
      
      // Update observer position based on mouse
      const mouse3D = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 0);
      fieldShader.uniforms.observerPosition.value = mouse3D;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Probability field particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial 
          attach="material" 
          args={[fieldShader]}
        />
      </points>
      
      {/* Career nodes */}
      {careerNodes.map((node, i) => (
        <group key={node.label} position={node.position}>
          {/* Node sphere */}
          <mesh>
            <sphereGeometry args={[0.3 * node.scale, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[0.5 * node.scale, 8, 8]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Label */}
          <Text
            position={[0, 0.8 * node.scale, 0]}
            fontSize={0.2 * node.scale}
            color={node.color}
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        </group>
      ))}
      
      {/* Probability paths */}
      {connections.map((connection, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                ...connection[0].toArray(),
                ...connection[1].toArray()
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.2 + quantumState * 0.3}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}