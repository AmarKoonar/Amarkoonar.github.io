"use client";
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useMemo } from 'react';
import { Environment, Lightformer, SoftShadows } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';
import Desktop from './Desktop';
import Room from './Room';
import CameraController from './CameraController';
import { SurfaceContext } from './SurfaceContext';
import { PhysicsWorld } from './PhysicsWorld';
import FreeRoam from './FreeRoam';
import { WorldContext, useWorld } from '../workspace/WorldState';
import { atmospheres } from '@/data/atmospheres';

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
export default function Scene({ progress, active, focus, focusReady, onFocusReady, reducedMotion, mobile, atmosphere = 'golden', showLabels = false, onSelect, onReady, onFailure }) {
  const world = useWorld();
  const surfaces = useRef(new Map());
  const context = useMemo(() => ({ surfaces, focus, focusReady, mobile, showLabels }), [focus, focusReady, mobile, showLabels]);
  const lighting = atmospheres[atmosphere];
  return <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={mobile ? 1 : [1, 1.5]} frameloop="demand" camera={{ position: [8.4, 7.6, 10.4], fov: mobile ? 48 : 39, near: 0.1, far: 100 }} gl={{ localClippingEnabled: true, antialias: !mobile, powerPreference: 'low-power', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05, outputColorSpace: SRGBColorSpace }} fallback={<span>Use the navigation to explore Amar’s portfolio.</span>}>
    <color attach="background" args={['#202923']} /><fog attach="fog" args={['#202923', 20, 48]} />
    {!mobile && <SoftShadows size={35} samples={16} />}
    <hemisphereLight args={['#cadce5', '#493525', lighting.bounce]} />
    <directionalLight position={[-8, 8, -10]} intensity={lighting.strength} color={lighting.key} castShadow shadow-mapSize={mobile ? [512, 512] : [2048, 2048]} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={11} shadow-camera-bottom={-11} shadow-camera-near={0.5} shadow-camera-far={40} shadow-normalBias={0.018} shadow-bias={-0.00015} />
    <directionalLight position={[4, 5, 6]} intensity={lighting.fillStrength} color={lighting.fill} />
    <Environment key={atmosphere} resolution={mobile ? 64 : 128} frames={1} environmentIntensity={lighting.environment}>
      <color attach="background" args={['#393e3b']} />
      <Lightformer position={[-5, 3, -5.5]} scale={[5.6, 5.4, 1]} intensity={lighting.window} color={lighting.key} />
      <Lightformer position={[3, 4, -4]} rotation={[0, Math.PI, 0]} scale={[4, 3, 1]} intensity={1.6} color="#c5dfef" />
      <Lightformer position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 5, 1]} intensity={0.8} color="#f0eadb" />
    </Environment>
    <WorldContext.Provider value={world}><SurfaceContext.Provider value={context}>
      <Room mobile={mobile} atmosphere={atmosphere} />
      <PhysicsWorld><Desktop active={active} focus={focus} onSelect={onSelect} reducedMotion={reducedMotion} mobile={mobile} /></PhysicsWorld>
      <FreeRoam focus={focus} onSelect={onSelect} />
      <CameraController progress={progress} focus={focus} surfaces={surfaces} onFocusReady={onFocusReady} reducedMotion={reducedMotion} mobile={mobile} />
    </SurfaceContext.Provider></WorldContext.Provider>
    <Lifecycle onReady={onReady} onFailure={onFailure} active={active} focus={focus} mobile={mobile} />
  </Canvas>;
}
