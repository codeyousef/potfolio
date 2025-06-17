import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GravitationalFieldProps {
  children: React.ReactNode;
  portalPosition?: [number, number, number];
  cursorPosition?: { x: number; y: number };
  gravitationalStrength?: number;
  repulsionRadius?: number;
  attractionRadius?: number;
}

const GravitationalField: React.FC<GravitationalFieldProps> = ({
  children,
  portalPosition = [0, 0, 0],
  cursorPosition = { x: 0, y: 0 },
  gravitationalStrength = 0.5,
  repulsionRadius = 100,
  attractionRadius = 200,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const childPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const childTargets = useRef<Map<string, THREE.Vector3>>(new Map());
  const childVelocities = useRef<Map<string, THREE.Vector3>>(new Map());

  // Convert screen cursor position to 3D world space
  const getWorldCursorPosition = (cursor: { x: number; y: number }) => {
    const normalizedX = (cursor.x / window.innerWidth) * 2 - 1;
    const normalizedY = -(cursor.y / window.innerHeight) * 2 + 1;
    
    return new THREE.Vector3(
      normalizedX * 50, // Scale to world coordinates
      normalizedY * 30,
      0
    );
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const portal = new THREE.Vector3(...portalPosition);
    const cursor = getWorldCursorPosition(cursorPosition);

    groupRef.current.children.forEach((child, index) => {
      const childId = `child-${index}`;
      
      // Initialize child data if not exists
      if (!childPositions.current.has(childId)) {
        childPositions.current.set(childId, child.position.clone());
        childTargets.current.set(childId, child.position.clone());
        childVelocities.current.set(childId, new THREE.Vector3());
      }

      const currentPos = childPositions.current.get(childId)!;
      const targetPos = childTargets.current.get(childId)!;
      const velocity = childVelocities.current.get(childId)!;

      // Calculate forces
      const forceVector = new THREE.Vector3();

      // 1. Gravitational attraction to portal (when idle)
      const distanceToPortal = currentPos.distanceTo(portal);
      if (distanceToPortal > attractionRadius) {
        const portalForce = portal.clone().sub(currentPos).normalize();
        portalForce.multiplyScalar(gravitationalStrength * 0.3);
        forceVector.add(portalForce);
      }

      // 2. Repulsion from cursor
      const distanceToCursor = currentPos.distanceTo(cursor);
      if (distanceToCursor < repulsionRadius) {
        const repulsionForce = currentPos.clone().sub(cursor).normalize();
        const repulsionStrength = (1 - distanceToCursor / repulsionRadius) * gravitationalStrength * 2;
        repulsionForce.multiplyScalar(repulsionStrength);
        forceVector.add(repulsionForce);
      }

      // 3. Magnetic snapping when dragging (simulated)
      const magneticZones = [
        new THREE.Vector3(0, 20, 0),   // Above portal
        new THREE.Vector3(0, -20, 0),  // Below portal
        new THREE.Vector3(30, 0, 0),   // Right
        new THREE.Vector3(-30, 0, 0),  // Left
      ];

      magneticZones.forEach(zone => {
        const distanceToZone = currentPos.distanceTo(zone);
        if (distanceToZone < 15) {
          const magneticForce = zone.clone().sub(currentPos).normalize();
          magneticForce.multiplyScalar(gravitationalStrength * 0.8);
          forceVector.add(magneticForce);
        }
      });

      // 4. Gentle drift motion when idle
      const driftForce = new THREE.Vector3(
        Math.sin(time * 0.2 + index) * 0.1,
        Math.cos(time * 0.15 + index) * 0.05,
        Math.sin(time * 0.1 + index) * 0.08
      );
      forceVector.add(driftForce);

      // Apply forces to velocity
      velocity.add(forceVector.multiplyScalar(delta));
      
      // Apply damping
      velocity.multiplyScalar(0.95);

      // Update position
      currentPos.add(velocity.clone().multiplyScalar(delta));

      // Apply constraints (keep within reasonable bounds)
      const maxDistance = 100;
      if (currentPos.distanceTo(portal) > maxDistance) {
        currentPos.copy(portal.clone().add(
          currentPos.clone().sub(portal).normalize().multiplyScalar(maxDistance)
        ));
      }

      // Update actual child position with smooth interpolation
      child.position.lerp(currentPos, 0.1);

      // Add subtle floating rotation
      child.rotation.x += Math.sin(time * 0.3 + index) * 0.001;
      child.rotation.y += Math.cos(time * 0.2 + index) * 0.001;
      child.rotation.z += Math.sin(time * 0.25 + index) * 0.0005;

      // Update stored positions
      childPositions.current.set(childId, currentPos);
    });
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

export default GravitationalField;