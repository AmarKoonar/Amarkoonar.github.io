"use client";
import { useContext, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { HoverContext } from './HoverContext';
import { useScreenPreview } from './ScreenPreview';

export function HoverScreen({size,kind='projects',color,litColor,...props}) {
  const {hovered,reducedMotion}=useContext(HoverContext),material=useRef(),{invalidate}=useThree();
  const texture=useScreenPreview(kind,size[1]>size[0]);
  useEffect(()=>invalidate(),[hovered,invalidate]);
  useFrame((_,dt)=>{const target=hovered?0.9:0.55;if(Math.abs(material.current.emissiveIntensity-target)<.001){material.current.emissiveIntensity=target;return;}material.current.emissiveIntensity=reducedMotion?target:MathUtils.damp(material.current.emissiveIntensity,target,8,Math.min(dt,.05));invalidate();});
  return <mesh {...props}><planeGeometry args={size}/><meshStandardMaterial ref={material} map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.3} metalness={0.12}/></mesh>;
}
export function HoverMotion({position=[0,0,0],rotation=[0,0,0],offset=[0,0,0],turn=[0,0,0],children}) {
  const {hovered,reducedMotion}=useContext(HoverContext),group=useRef(),{invalidate}=useThree();
  useEffect(()=>invalidate(),[hovered,reducedMotion,invalidate]);
  useFrame((_,dt)=>{let moving=false;for(let i=0;i<3;i++){const axis=['x','y','z'][i],p=position[i]+(hovered&&!reducedMotion?offset[i]:0),r=rotation[i]+(hovered&&!reducedMotion?turn[i]:0);for(const [value,target] of [[group.current.position,p],[group.current.rotation,r]]){if(Math.abs(value[axis]-target)>.0001){value[axis]=MathUtils.damp(value[axis],target,9,Math.min(dt,.05));moving=true;}else value[axis]=target;}}if(moving)invalidate();});
  return <group ref={group} position={position} rotation={rotation}>{children}</group>;
}
