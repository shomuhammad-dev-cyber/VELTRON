// ==============================================================================
// VALIXEN 3D SOVEREIGN VECTOR PRISM ENGINE (THREE.JS / REACT THREE FIBER)
// Metallic & Glass-Inspired Geometric Monolith
// ==============================================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function PrismGeometry() {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFrame((state: any, delta: number) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.8;
      coreRef.current.rotation.z += delta * 0.5;
    }
  });

  // Vector Prism Arm Geometries
  return (
    <group ref={meshRef}>
      {/* Central Suspended Quantum Core (Hex-Prism) */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Left Monolithic Arm */}
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.32, 2.2, 0.32]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.5}
          color="#8B5CF6"
          roughness={0.15}
        />
      </mesh>

      {/* Right Monolithic Arm */}
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.32, 2.2, 0.32]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.5}
          color="#00F0FF"
          roughness={0.15}
        />
      </mesh>

      {/* Floating Quantum Apex Facet */}
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#A78BFA"
          emissiveIntensity={1.8}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 180 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      coords[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      coords[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      coords[i * 3 + 2] = radius * Math.cos(phi);
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFrame((_: any, delta: number) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8B5CF6"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SovereignPrismScene() {
  return (
    <div className="w-full h-full min-h-[380px] md:min-h-[520px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-8, -8, -5]} intensity={2.0} color="#8B5CF6" />
        <pointLight position={[5, -5, 5]} intensity={2.5} color="#00F0FF" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <PrismGeometry />
          <ParticleField />
        </Float>
      </Canvas>
    </div>
  );
}
