import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useAethelframeStore } from '../../store/useAethelframeStore';

interface ArabicLetterProps {
  letter: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  speed: number;
  delay: number;
}

const ArabicLetter: React.FC<ArabicLetterProps> = ({ 
  letter, 
  position, 
  rotation, 
  size, 
  speed, 
  delay 
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(position);
  const initialRotation = useRef(rotation);
  const { currentPhase } = useAethelframeStore();
  
  // Different animation speeds based on the current phase
  const getAnimationSpeed = () => {
    switch(currentPhase) {
      case 'seed': return speed * 0.5;
      case 'growth': return speed * 0.8;
      case 'bloom': return speed;
      default: return speed;
    }
  };
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    
    const t = (clock.getElapsedTime() + delay) * getAnimationSpeed() * 0.1;
    
    // Floating animation
    ref.current.position.x = initialPosition.current[0] + Math.sin(t) * 0.5;
    ref.current.position.y = initialPosition.current[1] + Math.cos(t * 0.7) * 0.5;
    ref.current.position.z = initialPosition.current[2] + Math.sin(t * 0.5) * 0.5;
    
    // Rotation animation
    ref.current.rotation.x = initialRotation.current[0] + Math.sin(t * 0.5) * 0.2;
    ref.current.rotation.y = initialRotation.current[1] + Math.cos(t * 0.3) * 0.2;
    ref.current.rotation.z = initialRotation.current[2] + Math.sin(t * 0.2) * 0.2;
  });
  
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <Text
        fontSize={size}
        color="#5eead4"
        anchorX="center"
        anchorY="middle"
        opacity={0.2}
      >
        {letter}
      </Text>
    </mesh>
  );
};

const ArabicLettersBackground: React.FC = () => {
  const { currentPhase } = useAethelframeStore();
  
  // Generate Arabic letters data
  const arabicLetters = useMemo(() => {
    const letters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      letter: letters[i % letters.length],
      size: Math.random() * 3 + 1,
      position: [
        (Math.random() * 20 - 10),
        (Math.random() * 20 - 10),
        (Math.random() * 10 - 20)
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ] as [number, number, number],
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 10
    }));
  }, []);
  
  // Different number of letters based on the current phase
  const getLetterCount = () => {
    switch(currentPhase) {
      case 'seed': return 5;
      case 'growth': return 10;
      case 'bloom': return 15;
      default: return 15;
    }
  };
  
  return (
    <>
      {arabicLetters.slice(0, getLetterCount()).map((letter) => (
        <ArabicLetter
          key={letter.id}
          letter={letter.letter}
          position={letter.position}
          rotation={letter.rotation}
          size={letter.size}
          speed={letter.speed}
          delay={letter.delay}
        />
      ))}
    </>
  );
};

export default ArabicLettersBackground;