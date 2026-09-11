"use client";
import { useRef, useContext, useState } from 'react';
import { Html } from '@react-three/drei';
import { SurfaceContext } from './SurfaceContext';
import { useWorld } from '../workspace/WorldState';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Box } from './Primitives';
import InteractiveObject from './InteractiveObject';
import Surface from './Surface';
import { PageAbout } from '../workspace/ObjectContent';
export default function Notebook(props) {
  const world = useWorld(), {focus,focusReady} = useContext(SurfaceContext), pen=useRef();
  const [hovered,setHovered] = useState(false);
  const cover = useRef(); const { invalidate } = useThree();
  useFrame((_, dt) => { const target = props.active ? 2.55 : hovered && !props.reducedMotion ? .18 : 0; if (Math.abs(cover.current.rotation.z - target) > 0.001) { cover.current.rotation.z = props.reducedMotion ? target : MathUtils.damp(cover.current.rotation.z, target, 5, dt); invalidate(); } });
  useFrame(({clock},dt)=>{const inviting=focus==='about'&&focusReady&&!world.drawing;const target=inviting&&!props.reducedMotion ? .04+Math.max(0,Math.sin(clock.elapsedTime*3))*.045 : .02; if(pen.current){pen.current.position.y=props.reducedMotion?target:MathUtils.damp(pen.current.position.y,target,8,dt);}if(inviting&&!props.reducedMotion)invalidate();});
  return <InteractiveObject {...props} onHoverChange={setHovered} id="about" label="02 / About me" position={[3.7, 0.17, 1.4]} rotation={[0, -0.08, 0]} labelPosition={[0.15, 0.72, 0.15]}>
    <Box size={[1.02, 0.09, 1.36]} color="#d6cab0" radius={0.013} />
    <Surface id="about" size={[0.93, 1.25]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.056, 0]}><PageAbout /></Surface>
    <group ref={cover} position={[-0.51, 0.06, 0]}>
      <Box size={[1.04, 0.045, 1.39]} position={[0.52, 0, 0]} color="#b56f42" radius={0.016} />
    </group>
    <group ref={pen} position={[0.67,0.02,0]} rotation={[0,-0.1,0]} onClick={e=>{if(focus==='about'){e.stopPropagation();world.setDrawing(!world.drawing);}}}>
      <Box size={[0.045,0.045,1.1]} color="#222e2c" radius={0.015}/><Box size={[0.049,0.049,0.12]} position={[0,0,-.35]} color="#c4b897" metalness={.8} radius={.01}/>
      {focus==='about'&&<mesh><boxGeometry args={[.16,.1,1.2]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>}
      {focus==='about'&&focusReady&&<Html position={[0,.09,.75]} center zIndexRange={[14,13]}><button className={`pen-prompt ${world.drawing?'is-drawing':''}`} onClick={e=>{e.stopPropagation();world.setDrawing(!world.drawing);}}>{world.drawing?'Put pen down':'Draw ↗'}</button></Html>}
    </group>
  </InteractiveObject>;
}
