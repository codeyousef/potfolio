'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AbstractSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom geometry - abstract form
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 8);
    
    // Distort vertices for organic feel
    const positions = geo.attributes.position.array as Float32Array;
    const vertex = new THREE.Vector3();
    
    // Create noise-based distortion
    for (let i = 0; i < positions.length; i += 3) {
      vertex.set(positions[i], positions[i + 1], positions[i + 2]);
      
      // Simple noise function
      const noise = Math.sin(vertex.x * 0.3) * Math.cos(vertex.y * 0.3) * Math.sin(vertex.z * 0.3) * 0.3;
      const scale = 1 + noise;
      
      vertex.multiplyScalar(scale);
      
      positions[i] = vertex.x;
      positions[i + 1] = vertex.y;
      positions[i + 2] = vertex.z;
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);
  
  // Subtle animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Gentle rotation
    meshRef.current.rotation.x = time * 0.05;
    meshRef.current.rotation.y = time * 0.07;
    
    // Subtle breathing
    const scale = 1 + Math.sin(time * 0.5) * 0.02;
    meshRef.current.scale.setScalar(scale);
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#FFFFFF"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
        reflectivity={1}
        envMapIntensity={1}
      />
    </mesh>
  );
}