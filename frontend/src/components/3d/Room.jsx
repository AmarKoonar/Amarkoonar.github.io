"use client";
import { Box, Cylinder } from './Primitives';
import { useSurfaceMaps } from './SurfaceMaterials';
import { ROOM, roomSolids } from '@/lib/room.mjs';
import WindowView from './WindowView';

function Wall({ position, size, color = '#a3aa9c' }) {
  return <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.95} />
  </mesh>;
}

function Window({ atmosphere }) {
  return <group position={[-5, 2.7, ROOM.back]}>
    {/* The opening is real geometry so daylight can pass through its frame. */}
    <WindowView atmosphere={atmosphere} />
    {[-2.85, 0, 2.85].map(x => <Box key={x} position={[x, 0, 0.04]} size={[0.1, 5.6, 0.2]} color="#e0d8c5" radius={0.012} />)}
    {[-2.75, 0.2, 2.75].map(y => <Box key={y} position={[0, y, 0.04]} size={[5.8, 0.1, 0.2]} color="#e0d8c5" radius={0.012} />)}
    <Box position={[0, -2.82, 0.12]} size={[6.1, 0.14, 0.6]} color="#c7b99d" radius={0.025} />
    {[-1, 1].map(side => <group key={side} position={[side * 3.35, 0, 0.22]}>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i - 3) * 0.14, -0.25, Math.sin(i * 1.7) * 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 6.1, 0.12]} /><meshStandardMaterial color={i % 2 ? '#9b9d87' : '#b1b19a'} roughness={1} />
      </mesh>)}
    </group>)}
    <Cylinder args={[0.035, 0.035, 8.1, 12]} position={[0, 3.02, 0.26]} rotation={[0, 0, Math.PI / 2]} color="#393d33" metalness={0.65} roughness={0.3} />
  </group>;
}

function Cabinet() {
  return <group position={[4.7, -1.4, -4.45]}>
    <Box size={[4, 2.5, 1.45]} color="#6b5139" roughness={0.68} radius={0.035} />
    {[-0.99, 0.99].map(x => <group key={x}>
      <Box position={[x, 0, 0.74]} size={[1.93, 2.36, 0.06]} color="#826449" radius={0.015} />
      <Box position={[x + (x < 0 ? 0.73 : -0.73), 0.15, 0.81]} size={[0.035, 0.36, 0.06]} color="#c7b58b" metalness={0.7} roughness={0.28} radius={0.012} />
    </group>)}
    <Box position={[0, 1.28, 0]} size={[4.12, 0.1, 1.52]} color="#9a7b58" radius={0.025} />
    {['#56675a', '#a88760', '#b6b09a'].map((color, i) => <Box key={color} position={[-1.15, 1.4 + i * 0.11, 0]} size={[1.1 - i * 0.1, 0.1, 0.7]} rotation={[0, i * 0.08, 0]} color={color} radius={0.008} />)}
    <Cylinder args={[0.19, 0.3, 0.65, 24]} position={[1.1, 1.65, 0]} color="#c4b18d" roughness={0.35} />
  </group>;
}

function WallArt() {
  return <group position={[4.7, 3.25, ROOM.back + 0.2]}>
    <Box size={[3.8, 3.1, 0.12]} color="#443c30" radius={0.015} />
    <Box size={[3.58, 2.88, 0.025]} position={[0, 0, 0.075]} color="#c7bda5" radius={0} />
    <mesh position={[0.65, 0.5, 0.095]} receiveShadow><circleGeometry args={[0.59, 40]} /><meshStandardMaterial color="#b87a4c" roughness={1} /></mesh>
    <mesh position={[-0.25, -0.65, 0.105]} scale={[1.8, 0.85, 1]} receiveShadow><circleGeometry args={[0.78, 40, 0, Math.PI]} /><meshStandardMaterial color="#67725e" roughness={1} /></mesh>
    <mesh position={[0.55, -0.85, 0.115]} scale={[1.5, 0.8, 1]} receiveShadow><circleGeometry args={[0.65, 40, 0, Math.PI]} /><meshStandardMaterial color="#424e42" roughness={1} /></mesh>
  </group>;
}

function Plant({ mobile }) {
  return <group position={[-8.8, ROOM.floor, -3.6]}>
    <Cylinder args={[0.6, 0.43, 1.25, 28]} position={[0, 0.63, 0]} color="#b2a28a" roughness={0.9} />
    <Cylinder args={[0.55, 0.55, 0.04, 24]} position={[0, 1.25, 0]} color="#352c21" />
    <Cylinder args={[0.045, 0.075, 2.3, 12]} position={[0, 2.3, 0]} color="#66523b" />
    {Array.from({ length: mobile ? 8 : 14 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * 0.5, 2 + i % 5 * 0.38, Math.cos(i * 2.4) * 0.45]} rotation={[0.35, i * 2.4, Math.sin(i) * 0.55]} scale={[0.36, 0.78, 0.1]} castShadow receiveShadow>
      <sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={i % 2 ? '#536b43' : '#79845a'} roughness={0.75} />
    </mesh>)}
  </group>;
}

export default function Room({ mobile, atmosphere = 'golden' }) {
  const wood = useSurfaceMaps('wood');
  const fabric = useSurfaceMaps('fabric');
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ROOM.floor, 3.25]} receiveShadow>
      <planeGeometry args={[23, 17.5]} /><meshStandardMaterial {...wood} color="#c5b8a0" roughness={0.95} bumpScale={0.012} />
    </mesh>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-11.5 + i, ROOM.floor + 0.001, 3.25]} receiveShadow>
      <planeGeometry args={[0.012, 17.5]} /><meshStandardMaterial color="#544433" roughness={1} />
    </mesh>)}
    <Box size={[12.2, 0.025, 7.5]} position={[0, ROOM.floor + 0.018, 0.5]} color="#656c58" radius={0.01} roughness={1} materialProps={{ bumpMap: fabric.bumpMap, roughnessMap: fabric.roughnessMap, bumpScale: 0.012 }} />
    {/* Back wall pieces surround the 5.6 × 5.4 window opening. */}
    <Wall position={[-9.65, 3.915, ROOM.back]} size={[3.7, 13.17, 0.24]} />
    <Wall position={[4.65, 3.915, ROOM.back]} size={[13.7, 13.17, 0.24]} />
    <Wall position={[-5, -1.335, ROOM.back]} size={[5.6, 2.67, 0.24]} />
    <Wall position={[-5, 7.95, ROOM.back]} size={[5.6, 5.1, 0.24]} />
    {roomSolids.slice(1, 5).map((wall, i) => <Wall key={i} {...wall} color={i === 3 ? '#c4c3b2' : '#899383'} />)}
    <Box position={[0, ROOM.floor + 0.16, ROOM.back + 0.16]} size={[23, 0.32, 0.12]} color="#d1c9b5" radius={0.005} />
    {[-1, 1].map(side => <Box key={side} position={[side * 11.32, ROOM.floor + 0.16, 3.25]} size={[0.12, 0.32, 17.5]} color="#c2bdab" radius={0.005} />)}
    <Window atmosphere={atmosphere} /><Cabinet /><WallArt /><Plant mobile={mobile} />
    <pointLight position={[4.7, 2, -3.5]} intensity={atmosphere === 'night' ? 18 : 2} color="#ffce92" distance={8} decay={2} />
    <Box position={[4.7, 1.5, ROOM.back + 0.45]} size={[4.5, 0.1, 0.8]} color="#64533c" radius={0.025} />
    <mesh position={[4.7, 1.44, ROOM.back + 0.55]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.1, 0.16]} /><meshBasicMaterial color={atmosphere === 'night' ? '#ffd39c' : '#b6a481'} toneMapped={false} />
    </mesh>
  </group>;
}
