"use client";
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Object3D } from 'three';
import InteractiveObject from './InteractiveObject';
import { HoverScreen } from './HoverDetails';
import { Box } from './Primitives';
import Surface from './Surface';
import Terminal from '../workspace/Terminal';
import LaptopAudio from './LaptopAudio';

function Keycaps() {
  const mesh = useRef();
  useEffect(() => {
    const key = new Object3D();
    for (let i = 0; i < 48; i++) {
      key.position.set(-0.71 + (i % 12) * 0.13, 0.07, -0.39 + Math.floor(i / 12) * 0.13);
      key.updateMatrix(); mesh.current.setMatrixAt(i, key.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={mesh} args={[null, null, 48]}><boxGeometry args={[0.105, 0.016, 0.087]} /><meshStandardMaterial color="#454b4b" roughness={0.6} /></instancedMesh>;
}

export default function Laptop(props) {
  const [hovered,setHovered] = useState(false);
  const lid = useRef(); const { invalidate } = useThree();
  useFrame((_, dt) => { const target = props.active ? -0.16 : hovered && !props.reducedMotion ? -0.25 : -0.37; if (Math.abs(lid.current.rotation.x - target) > 0.001) { lid.current.rotation.x = props.reducedMotion ? target : MathUtils.damp(lid.current.rotation.x, target, 6, dt); invalidate(); } });
  return <group position={[-2.65, 0.12, -0.85]} rotation={[0, 0.13, 0]}>
    <Box size={[1.22, 0.06, 0.85]} position={[0, 0.035, 0]} color="#59645f" metalness={0.8} />
    <Box size={[0.12, 0.65, 0.45]} position={[0, 0.36, -0.12]} rotation={[0.2, 0, 0]} color="#89918b" metalness={0.8} />
    <Box size={[1.64, 0.05, 0.99]} position={[0, 0.69, 0]} color="#727d77" metalness={0.75} />
    <InteractiveObject {...props} onHoverChange={setHovered} id="laptop" label="Terminal / Open laptop" position={[0, 0.77, 0]} labelPosition={[-0.15, 1.5, 0]}>
    <Box size={[1.85, 0.09, 1.22]} color="#888c88" metalness={0.8} />
    <Box position={[0, 0.052, -0.18]} size={[1.61, 0.013, 0.58]} color="#1a2021" radius={0.005} />
    <Keycaps /><LaptopAudio />
    <Box size={[0.65, 0.008, 0.28]} position={[0, 0.052, 0.35]} color="#a4aaa5" radius={0.012} />
    <group ref={lid} position={[0, 0.04, -0.55]} rotation={[-0.37, 0, 0]}>
      <Box size={[1.85, 1.15, 0.055]} position={[0, 0.565, 0]} color="#555d5c" metalness={0.65} />
      <HoverScreen position={[0, 0.58, 0.031]} size={[1.72, 0.98]} color="#13221c" />
      <Surface id="laptop" label="Linux terminal on the laptop" size={[1.72, 0.98]} position={[0, 0.58, 0.036]} tone="screen"><Terminal /></Surface>
      <mesh position={[0, 1.1, 0.033]}><sphereGeometry args={[0.015, 8, 8]} /><meshBasicMaterial color="#abbcb2" /></mesh>
    </group>
    </InteractiveObject>
  </group>;
}
