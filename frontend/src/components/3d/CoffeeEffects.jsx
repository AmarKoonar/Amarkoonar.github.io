"use client";
import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Object3D, Plane, Vector3 } from 'three';
import { useWorld } from '../workspace/WorldContext';
export default function CoffeeEffects({cup=false}){
  const {coffee,epoch}=useWorld(),{invalidate}=useThree(),root=useRef(),liquid=useRef(),drops=useRef(),elapsed=useRef(0),dummy=useMemo(()=>new Object3D(),[]);
  useEffect(()=>{elapsed.current=0;invalidate();},[coffee,epoch,invalidate]);
  useFrame((_,dt)=>{
    if(!coffee){if(cup)liquid.current.position.y=.385;root.current.visible=false;return;}
    elapsed.current=Math.min(18,elapsed.current+Math.min(dt,.05));const t=elapsed.current;
    if(cup){liquid.current.position.y=.385+Math.min(1,t/2)*.055;root.current.visible=t>2;root.current.scale.y=Math.min(1,(t-2)/2);}
    else{root.current.visible=t>2;root.current.scale.setScalar(Math.max(.001,Math.min(1,(t-2)/12)));for(let i=0;i<40;i++){const phase=(t*1.2+i*.173)%1,angle=i*2.399;dummy.position.set(-2.9+Math.cos(angle)*phase*.8,.58-phase*phase*.44,.55+Math.sin(angle)*phase*.8);dummy.scale.setScalar(t<14?.015+(i%4)*.006:0);dummy.updateMatrix();drops.current.setMatrixAt(i,dummy.matrix);}drops.current.instanceMatrix.needsUpdate=true;}
    if(t<18)invalidate();
  });
  const clip=useMemo(()=>[new Plane(new Vector3(1,0,0),4.72),new Plane(new Vector3(-1,0,0),4.72),new Plane(new Vector3(0,0,1),2.28),new Plane(new Vector3(0,0,-1),2.28)],[]);
  const material=<meshPhysicalMaterial clippingPlanes={cup?null:clip} color="#29140b" roughness={.12} metalness={.12} clearcoat={1} clearcoatRoughness={.08}/>;
  if(cup)return <><mesh ref={liquid} position={[0,.385,0]}><cylinderGeometry args={[.218,.218,.01,32]}/>{material}</mesh><group ref={root} visible={false} position={[0,.43,0]}>{Array.from({length:9},(_,i)=><mesh key={i} position={[Math.cos(i*.7)*.233,-.2,Math.sin(i*.7)*.233]} scale={[.026,.22,.021]}><sphereGeometry args={[1,8,8]}/>{material}</mesh>)}</group></>;
  return <><group ref={root} visible={false} position={[-2.9,.134,.55]}>{Array.from({length:16},(_,i)=>{const a=i*2.4;return <mesh key={i} position={[1.4+Math.cos(a)*(i%4)*.42,(i%3)*.001,Math.sin(a)*.78]} rotation={[-Math.PI/2,0,a]} scale={[1.45+(i%3)*.13,.48+(i%4)*.08,1]}><circleGeometry args={[1,32]}/>{material}</mesh>;})}<mesh position={[1.4,.008,1.65]} rotation={[-Math.PI/2,0,0]} scale={[1.8,.12,1]}><circleGeometry args={[1,32]}/>{material}</mesh></group><instancedMesh visible={Boolean(coffee)} ref={drops} args={[null,null,40]} frustumCulled={false}><sphereGeometry args={[1,6,6]}/>{material}</instancedMesh></>;
}
