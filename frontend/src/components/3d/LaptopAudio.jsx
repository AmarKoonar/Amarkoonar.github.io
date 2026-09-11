"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useWorld } from '../workspace/WorldContext';
export default function LaptopAudio(){
  const {audio,music}=useWorld(),anchor=useRef(),bars=useRef(),v=useMemo(()=>({source:new Vector3(),direction:new Vector3(),up:new Vector3()}),[]);
  useFrame(({camera,clock,invalidate})=>{
    if(music!=='playing'||!audio.current)return;
    anchor.current.getWorldPosition(v.source);const {ctx,panner}=audio.current,listener=ctx.listener;
    panner.positionX.value=v.source.x;panner.positionY.value=v.source.y;panner.positionZ.value=v.source.z;
    camera.getWorldDirection(v.direction);v.up.set(0,1,0).applyQuaternion(camera.quaternion);
    if(listener.positionX){listener.positionX.value=camera.position.x;listener.positionY.value=camera.position.y;listener.positionZ.value=camera.position.z;listener.forwardX.value=v.direction.x;listener.forwardY.value=v.direction.y;listener.forwardZ.value=v.direction.z;listener.upX.value=v.up.x;listener.upY.value=v.up.y;listener.upZ.value=v.up.z;}
    bars.current.children.forEach((b,i)=>b.scale.y=.3+Math.abs(Math.sin(clock.elapsedTime*4+i*1.2))*.7);invalidate();
  });
  return <group ref={anchor}><group ref={bars} visible={music==='playing'} position={[0,.73,-.32]}>{[0,1,2,3,4,5,6,7].map(i=><mesh key={i} position={[(i-3.5)*.14,0,0]}><boxGeometry args={[.07,.4,.012]}/><meshBasicMaterial color="#b7dc88"/></mesh>)}</group></group>;
}
