"use client";
import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, CatmullRomCurve3, Vector3, Object3D } from 'three';
import { Box, Cylinder } from './Primitives';
import InteractiveObject from './InteractiveObject';
import Laptop from './Laptop';
import Monitor from './Monitor';
import Phone from './Phone';
import Notebook from './Notebook';
import ResumePaper from './ResumePaper';
import Surface from './Surface';
import { HoverMotion } from './HoverDetails';
import { PhysicsObject } from './PhysicsWorld';
import CoffeeEffects from './CoffeeEffects';
import { PageCoursework } from '../workspace/ObjectContent';

function Wood() {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#73543a'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      const seed = Math.sin(i * 78.233) * 43758.5453; const noise = seed - Math.floor(seed);
      ctx.strokeStyle = `rgba(${i % 3 ? '30,19,9' : '210,170,114'},${0.025 + noise * 0.09})`;
      ctx.lineWidth = 0.3 + noise; ctx.beginPath();
      for (let x = 0; x <= 512; x += 8) { const y = i / 900 * 512 + Math.sin(x / 95 + i) * 1.6; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    const texture = new CanvasTexture(canvas); texture.wrapS = texture.wrapT = RepeatWrapping; texture.repeat.set(2, 1); texture.colorSpace = SRGBColorSpace; return texture;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  return <mesh receiveShadow castShadow><boxGeometry args={[9.5, 0.22, 4.6]} /><meshStandardMaterial map={map} roughness={0.63} /></mesh>;
}
function Cable({ points }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
  return <mesh><tubeGeometry args={[curve, 24, 0.018, 6, false]} /><meshStandardMaterial color="#202522" roughness={0.9} /></mesh>;
}
function Keyboard() {
  const keys = useRef();
  useEffect(() => {
    const matrix = new Object3D();
    for (let i = 0; i < 56; i++) { matrix.position.set(-0.94 + i % 14 * 0.143, 0.085, -0.245 + Math.floor(i / 14) * 0.16); matrix.updateMatrix(); keys.current.setMatrixAt(i, matrix.matrix); }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={[0.1, 0.18, 0.15]}>
    <Box size={[2.2, 0.1, 0.81]} color="#b3b4a2" radius={0.04} />
    <instancedMesh ref={keys} args={[null, null, 56]} castShadow><boxGeometry args={[0.123, 0.06, 0.125]} /><meshStandardMaterial color="#d2d1be" roughness={0.62} /></instancedMesh>
    <Box size={[0.8, 0.04, 0.12]} position={[0, 0.09, 0.3]} color="#d2d1be" radius={0.01} />
    <Box size={[0.13, 0.045, 0.12]} position={[-0.95, 0.09, -0.25]} color="#bf764b" radius={0.01} />
  </group>;
}
function StudyStack(props) {
  return <InteractiveObject {...props} id="coursework" label="03 / Coursework" position={[-3.9, 0.18, 0.8]} rotation={[0, 0.12, 0]} labelPosition={[0, 0.95, 0]}>
    <Box size={[1.08, 0.2, 1.43]} color="#3e5652" />
    <Box size={[1.01, 0.14, 1.36]} position={[0.03, 0.02, 0]} color="#c9c4b0" radius={0.012} />
    <Box size={[1.08, 0.035, 1.43]} position={[0, 0.115, 0]} color="#3e5652" radius={0.01} />
    <HoverMotion position={[0.08, 0.22, 0]} rotation={[0, -0.15, 0]} offset={[.08,0,-.03]} turn={[0,.09,0]}>
      <Box size={[1.03, 0.18, 1.32]} color="#a96046" />
      <Surface id="coursework" size={[0.94, 1.21]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.097, 0]}><PageCoursework /></Surface>
    </HoverMotion>
  </InteractiveObject>;
}
function Accessories({ mobile }) {
  return <>
    <PhysicsObject id="keyboard" mass={1.1}><Keyboard /></PhysicsObject>
    <Box size={[0.65, 0.014, 0.75]} position={[1.65, 0.14, 0.16]} color="#353d35" radius={0.03} />
    <PhysicsObject id="mouse" mass={0.15}><mesh position={[1.65, 0.23, 0.14]} scale={[0.2, 0.11, 0.3]} castShadow><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#c9cbbc" roughness={0.35} /></mesh>
    <Box size={[0.014, 0.012, 0.18]} position={[1.65, 0.335, 0.03]} color="#777e72" radius={0.002} /></PhysicsObject>
    <PhysicsObject id="coffee" mass={0.4}><group position={[-2.9, 0.16, 0.55]} rotation={[0, Math.PI / 2, 0]}>
      <Cylinder args={[0.32, 0.32, 0.025, 32]} color="#ad8e62" />
      <Cylinder args={[0.24, 0.19, 0.4, 32]} color="#dad2b9" position={[0, 0.21, 0]} />
      <CoffeeEffects cup />
      <mesh position={[-0.27, 0.23, 0]}><torusGeometry args={[0.13, 0.039, 8, 20]} /><meshStandardMaterial color="#dad2b9" /></mesh>
    </group>
    </PhysicsObject>
    <PhysicsObject id="plant" mass={1.3}><group position={[3.14, 0.13, -1.55]}>
      <Cylinder args={[0.29, 0.2, 0.49, 24]} position={[0, 0.25, 0]} color="#ad7857" />
      <Cylinder args={[0.265, 0.265, 0.03, 24]} position={[0, 0.49, 0]} color="#322d21" />
      {Array.from({ length: mobile ? 5 : 9 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * 0.17, 0.66 + i % 3 * 0.12, Math.cos(i * 2.4) * 0.17]} rotation={[Math.sin(i) * 0.7, i, Math.cos(i) * 0.6]} scale={[0.13, 0.36, 0.055]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={i % 2 ? '#566c45' : '#75845b'} roughness={0.85} /></mesh>)}
    </group>
    </PhysicsObject>
    <PhysicsObject id="lamp" mass={2}><group position={[-4.15, 0.14, -1.65]} rotation={[0, -Math.PI / 2, 0]}>
      <Cylinder args={[0.37, 0.39, 0.09, 24]} color="#2a3934" />
      <Cylinder args={[0.035, 0.035, 1.7, 12]} position={[0, 0.86, 0]} color="#3d5148" />
      <group position={[0.45, 1.73, 0]} rotation={[0, 0, -0.36]}>
        <Cylinder args={[0.035, 0.035, 1, 12]} rotation={[0, 0, Math.PI / 2]} color="#3d5148" />
        <Cylinder args={[0.12, 0.34, 0.25, 24]} position={[0.45, -0.12, 0]} color="#53634c" />
        <mesh position={[0.45, -0.249, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.3, 24]} /><meshBasicMaterial color="#f7d697" /></mesh>
      </group>
    </group>
    </PhysicsObject>
    {!mobile && <>
      <Cable points={[[0, 0.2, -1.05], [0.4, 0.15, -1.6], [1.2, 0.15, -1.9], [1.8, 0.14, -2.3], [1.8, -0.8, -2.45]]} />
      <Cable points={[[-3.58, 0.9, -0.85], [-3.7, 0.4, -1.2], [-3.4, 0.15, -1.5], [-1.7, 0.15, -1.7], [-1, 0.14, -2.3]]} />
      <PhysicsObject id="note" mass={0.04}><Box size={[0.6, 0.025, 0.55]} position={[-0.97, 0.14, 1.67]} rotation={[0, 0.2, 0]} color="#dac78b" radius={0.003} /></PhysicsObject>
    </>}
  </>;
}
export default function Desktop({ active, focus, onSelect, reducedMotion, mobile }) {
  const props = (id) => ({ active: active === id, onSelect, reducedMotion });
  return <group>
    <Wood />
    {[-4, 4].map((x) => <group key={x} position={[x, -1.35, 0]}><Box size={[0.12, 2.5, 3.7]} color="#252d29" radius={0.02} metalness={0.5} /><Box size={[0.7, 0.08, 3.9]} position={[0, -1.23, 0]} color="#252d29" radius={0.025} /></group>)}
    <Box size={[4.3, 0.017, 2.45]} position={[-0.3, 0.124, 0.22]} color="#293b36" radius={0.025} />
    <PhysicsObject id="laptop" mass={3}><Laptop {...props(focus === 'laptop' ? active : 'laptop')} /></PhysicsObject><PhysicsObject id="monitor" mass={5}><Monitor {...props('projects')} /></PhysicsObject><PhysicsObject id="notebook" mass={0.7}><Notebook {...props('about')} /></PhysicsObject><PhysicsObject id="phone" mass={0.2}><Phone {...props('contact')} /></PhysicsObject>
    <PhysicsObject id="resume" mass={0.04}><ResumePaper {...props('resume')} /></PhysicsObject><PhysicsObject id="books" mass={1.8}><StudyStack {...props('coursework')} /></PhysicsObject><Accessories mobile={mobile} /><CoffeeEffects />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.67, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#202923" roughness={0.96} /></mesh>
  </group>;
}
