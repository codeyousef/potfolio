import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Node {
  position: THREE.Vector3;
  connections: number[];
  activity: number;
}

export default function AIBrain() {
  const brainRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate neural network structure
  const nodes = useMemo(() => {
    const nodeCount = 30; // Reduced from 100
    const nodeArray: Node[] = [];
    
    // Create nodes in 3D space
    for (let i = 0; i < nodeCount; i++) {
      const radius = Math.random() * 1.5 + 0.5; // Smaller radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      nodeArray.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        connections: [],
        activity: Math.random()
      });
    }
    
    // Create connections
    nodeArray.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i) {
          node.connections.push(targetIndex);
        }
      }
    });
    
    nodesRef.current = nodeArray;
    return nodeArray;
  }, []);

  // Create particle system for additional effect
  const particles = useMemo(() => {
    const particleCount = 200; // Reduced from 500
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 3 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Color gradient from blue to purple
      const t = i / particleCount;
      colors[i * 3] = 0.054 + t * 0.5; // R
      colors[i * 3 + 1] = 0.647 - t * 0.3; // G
      colors[i * 3 + 2] = 0.913 + t * 0.087; // B
    }
    
    return { positions, colors };
  }, []);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (brainRef.current) {
      // Gentle rotation
      brainRef.current.rotation.y = time * 0.1;
      brainRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -time * 0.05;
    }
    
    // Animate node pulses
    if (brainRef.current) {
      brainRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && nodes[i]) {
          const pulse = Math.sin(time * 2 + i * 0.1) * 0.1 + 1;
          child.scale.setScalar(pulse * nodes[i].activity);
          
          // Update emissive intensity
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissiveIntensity = nodes[i].activity * pulse;
          }
        }
      });
    }
  });

  return (
    <>
      {/* Main brain structure */}
      <group ref={brainRef}>
        {/* Neural Nodes */}
        {nodes.map((node, i) => (
          <mesh key={`node-${i}`} position={node.position}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial
              color="#0EA5E9"
              emissive="#0EA5E9"
              emissiveIntensity={node.activity * 0.5}
              metalness={0.6}
              roughness={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
        
        {/* Neural Connections */}
        {nodes.map((node, i) => 
          node.connections.map((targetIndex, j) => (
            <NeuralConnection
              key={`connection-${i}-${j}`}
              start={node.position}
              end={nodes[targetIndex].position}
              activity={node.activity}
            />
          ))
        )}
      </group>
      
      {/* Ambient particle cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

// Neural connection component
function NeuralConnection({ start, end, activity }: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  activity: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  
  // Create curved path
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2 + 0.2,
      (start.z + end.z) / 2
    );
    
    return new THREE.CatmullRomCurve3([start, midPoint, end]);
  }, [start, end]);
  
  const points = curve.getPoints(30);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (lineRef.current && lineRef.current.material instanceof THREE.LineBasicMaterial) {
      lineRef.current.material.opacity = activity * (Math.sin(time * 3) * 0.3 + 0.7);
    }
  });
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#8B5CF6"
        transparent
        opacity={activity * 0.15}
        linewidth={1}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}