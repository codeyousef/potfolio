import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
  fileType: string;
  timestamp: number;
  message: string;
  additions: number;
  deletions: number;
}

interface Connection {
  start: [number, number, number];
  end: [number, number, number];
}

interface NeuralNetworkProps {
  nodes: Node[];
  connections: Connection[];
  activity: number;
}

// File type colors
const fileTypeColors: Record<string, THREE.Color> = {
  'js': new THREE.Color('#F7DF1E'),
  'ts': new THREE.Color('#3178C6'),
  'tsx': new THREE.Color('#61DAFB'),
  'css': new THREE.Color('#1572B6'),
  'html': new THREE.Color('#E34F26')
};

export default function NeuralNetwork({ nodes, connections, activity }: NeuralNetworkProps) {
  const networkRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Create particle system for neurons
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    
    nodes.forEach((node, i) => {
      positions[i * 3] = node.x;
      positions[i * 3 + 1] = node.y;
      positions[i * 3 + 2] = node.z;
      
      const color = fileTypeColors[node.fileType] || new THREE.Color('#00FF41');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });
    
    return [positions, colors];
  }, [nodes]);

  // Create shader material for connections
  const connectionMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      activity: { value: 0 },
      mousePosition: { value: new THREE.Vector3() }
    },
    vertexShader: `
      varying vec3 vPosition;
      
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float activity;
      uniform vec3 mousePosition;
      varying vec3 vPosition;
      
      void main() {
        // Distance along the connection
        float t = length(vPosition);
        
        // Pulse along connections
        float pulse = sin(t * 10.0 - time * 5.0) * 0.5 + 0.5;
        
        // React to mouse proximity
        float dist = distance(vPosition, mousePosition);
        float proximity = 1.0 - smoothstep(0.0, 5.0, dist);
        
        // Base color: matrix green
        vec3 color = vec3(0.0, 1.0, 0.4);
        
        // Add activity glow
        color += vec3(1.0, 0.0, 0.5) * activity * pulse;
        
        // Mouse interaction
        color += vec3(0.0, 0.8, 1.0) * proximity;
        
        float alpha = (0.3 + pulse * 0.4 + proximity * 0.3) * activity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (networkRef.current) {
      networkRef.current.rotation.y = time * 0.1;
      networkRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const array = positions.array as Float32Array;
      
      // Animate particles based on activity
      nodes.forEach((node, i) => {
        const offset = Math.sin(time * 2 + i) * 0.1 * activity;
        array[i * 3 + 1] = node.y + offset;
      });
      
      positions.needsUpdate = true;
    }
    
    // Update shader uniforms
    connectionMaterial.uniforms.time.value = time;
    connectionMaterial.uniforms.activity.value = activity;
    connectionMaterial.uniforms.mousePosition.value.set(
      mouse.x * 5,
      mouse.y * 5,
      0
    );
  });

  return (
    <group ref={networkRef}>
      {/* Neurons/Nodes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.8}
        />
      </points>
      
      {/* Synaptic connections */}
      {connections.map((connection, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...connection.start, ...connection.end])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00FF41"
            opacity={0.3 + activity * 0.5}
            transparent
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
      
      {/* Activity indicators */}
      {nodes.filter((_, i) => i % 10 === 0).map((node, i) => (
        <mesh key={`activity-${i}`} position={[node.x, node.y, node.z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="#00FF41"
            transparent
            opacity={activity}
          />
        </mesh>
      ))}
    </group>
  );
}