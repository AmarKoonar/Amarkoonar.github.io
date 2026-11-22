"use client";
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useMemo } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import Desktop from './Desktop';
import CameraController from './CameraController';
import { SurfaceContext } from './SurfaceContext';
import { PhysicsWorld } from './PhysicsWorld';
import FreeRoam from './FreeRoam';
import { WorldContext, useWorld } from '../workspace/WorldState';

function Lifecycle({ onReady, onFailure, active, focus, mobile }) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const failed = (e) => { e.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', failed); onReady();
    const wake = () => { if (!document.hidden) invalidate(); };
    const onScroll = () => invalidate();
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { gl.domElement.removeEventListener('webglcontextlost', failed); document.removeEventListener('visibilitychange', wake); window.removeEventListener('scroll', onScroll); };
  }, [gl, invalidate, onReady, onFailure]);
  useEffect(() => { invalidate(); }, [active, focus, mobile, invalidate]);
  return null;
}
export default function Scene({ progress, active, focus, focusReady, onFocusReady, reducedMotion, mobile, onSelect, onReady, onFailure }) {
  const world = useWorld();
  const surfaces = useRef(new Map());
  const context = useMemo(() => ({ surfaces, focus, focusReady, mobile }), [focus, focusReady, mobile]);
  return <Canvas shadows={!mobile} dpr={mobile ? 1 : [1, 1.5]} frameloop="demand" camera={{ position: [8.4, 7.6, 10.4], fov: mobile ? 48 : 39, near: 0.1, far: 100 }} gl={{ localClippingEnabled: true, antialias: !mobile, powerPreference: 'low-power', toneMapping: ACESFilmicToneMapping }} fallback={<span>Use the navigation to explore Amar’s portfolio.</span>}>
    <color attach="background" args={['#202923']} /><fog attach="fog" args={['#202923', 20, 48]} />
    <ambientLight intensity={0.6} color="#e2dccb" />
    <hemisphereLight args={['#d7dfd2', '#423326', 1.5]} />
    <directionalLight position={[-3, 8, 5]} intensity={3.1} color="#ffe3b0" castShadow={!mobile} shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={0.04} shadow-bias={-0.0002} />
    <directionalLight position={[4, 4, -5]} intensity={2} color="#a4c0bf" />
    <pointLight position={[-4.15, 1.85, -0.8]} color="#ffc16d" intensity={active === 'home' ? 7 : 5} distance={5} decay={2} />
    {!mobile && <Environment resolution={128} frames={1}><Lightformer position={[-4, 5, 3]} scale={[6, 4, 1]} intensity={2.5} color="#ffe0ad" /><Lightformer position={[3, 4, -4]} rotation={[0, Math.PI, 0]} scale={[5, 3, 1]} intensity={1.5} color="#b6d5d0" /></Environment>}
    <WorldContext.Provider value={world}><SurfaceContext.Provider value={context}>
      <PhysicsWorld><Desktop active={active} focus={focus} onSelect={onSelect} reducedMotion={reducedMotion} mobile={mobile} /></PhysicsWorld>
      <FreeRoam focus={focus} onSelect={onSelect} />
      <CameraController progress={progress} focus={focus} surfaces={surfaces} onFocusReady={onFocusReady} reducedMotion={reducedMotion} mobile={mobile} />
    </SurfaceContext.Provider></WorldContext.Provider>
    <Lifecycle onReady={onReady} onFailure={onFailure} active={active} focus={focus} mobile={mobile} />
  </Canvas>;
}
