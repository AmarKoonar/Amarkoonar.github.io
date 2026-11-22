"use client";
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, MathUtils } from 'three';
import { HoverContext } from './HoverContext';

export function HoverScreen({size,color='#182927',litColor='#48756a',...props}) {
  const {hovered,reducedMotion}=useContext(HoverContext),material=useRef(),{invalidate}=useThree();
  const colors=useMemo(()=>[new Color(color),new Color(litColor)],[color,litColor]);
  useEffect(()=>invalidate(),[hovered,invalidate]);
  useFrame((_,dt)=>{const target=colors[hovered?1:0];if(material.current.color.equals(target))return;material.current.color.lerp(target,reducedMotion?1:1-Math.exp(-8*Math.min(dt,.05)));if(Math.abs(material.current.color.r-target.r)+Math.abs(material.current.color.g-target.g)+Math.abs(material.current.color.b-target.b)<.001)material.current.color.copy(target);else invalidate();});
  return <mesh {...props}><planeGeometry args={size}/><meshBasicMaterial ref={material} color={color} toneMapped={false}/></mesh>;
}
export function HoverMotion({position=[0,0,0],rotation=[0,0,0],offset=[0,0,0],turn=[0,0,0],children}) {
  const {hovered,reducedMotion}=useContext(HoverContext),group=useRef(),{invalidate}=useThree();
  useEffect(()=>invalidate(),[hovered,reducedMotion,invalidate]);
  useFrame((_,dt)=>{let moving=false;for(let i=0;i<3;i++){const axis=['x','y','z'][i],p=position[i]+(hovered&&!reducedMotion?offset[i]:0),r=rotation[i]+(hovered&&!reducedMotion?turn[i]:0);for(const [value,target] of [[group.current.position,p],[group.current.rotation,r]]){if(Math.abs(value[axis]-target)>.0001){value[axis]=MathUtils.damp(value[axis],target,9,Math.min(dt,.05));moving=true;}else value[axis]=target;}}if(moving)invalidate();});
  return <group ref={group} position={position} rotation={rotation}>{children}</group>;
}
