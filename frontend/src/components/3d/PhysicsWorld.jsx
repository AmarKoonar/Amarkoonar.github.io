"use client";
import { createContext, useContext, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Vector3, Quaternion, Plane } from 'three';
import { useWorld } from '../workspace/WorldContext';
const PhysicsContext=createContext(null);
let rapierPromise;
export function PhysicsWorld({children}){
  const state=useWorld(), {invalidate,gl,camera}=useThree(), entries=useRef(new Map()), simulation=useRef(null), grabbing=useRef(null), running=useRef(false), accumulator=useRef(0), api=useRef({});
  const alive=useRef(true);
  const current=useRef(state);current.current=state;
  const prepare=async()=>{
    if(simulation.current)return simulation.current;
    rapierPromise ||= import('@dimforge/rapier3d-compat').then(async module=>{const R=module.default||module;await R.init();return R;});
    const R=await rapierPromise;if(!alive.current)throw new Error('Scene closed');if(simulation.current)return simulation.current;
    const world=new R.World({x:0,y:-9.81,z:0});
    world.createCollider(R.ColliderDesc.cuboid(4.75,.11,2.3).setTranslation(0,0,0).setFriction(.65));
    world.createCollider(R.ColliderDesc.cuboid(24,.1,24).setTranslation(0,-2.78,0).setFriction(.8));
    for(const x of [-4,4])world.createCollider(R.ColliderDesc.cuboid(.08,1.28,1.85).setTranslation(x,-1.4,0));
    for(const entry of entries.current.values()){
      entry.group.updateWorldMatrix(true,true);const box=new Box3().setFromObject(entry.group),center=box.getCenter(new Vector3()),size=box.getSize(new Vector3());
      entry.center=center;entry.size=size;
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(...center.toArray()).setLinearDamping(.35).setAngularDamping(.45).setCcdEnabled(true).setSleeping(true));
      world.createCollider(R.ColliderDesc.cuboid(Math.max(.035,size.x/2),Math.max(.025,size.y/2),Math.max(.035,size.z/2)).setMass(entry.mass).setFriction(.55).setRestitution(.18),body);
      entry.body=body;
    }
    simulation.current={R,world};return simulation.current;
  };
  api.current={entries,grabbing,prepare,grab:(id,e)=>{
    if(!current.current.creative||current.current.program)return;
    const entry=entries.current.get(id);if(!entry?.body)return;
    e.stopPropagation();e.target.setPointerCapture?.(e.pointerId);
    const direction=new Vector3();camera.getWorldDirection(direction);const point=e.point.clone();
    grabbing.current={entry,plane:new Plane().setFromNormalAndCoplanarPoint(direction,point),target:point.clone(),local:point.clone().sub(new Vector3().copy(entry.body.translation())).applyQuaternion(new Quaternion().copy(entry.body.rotation()).invert()),distance:camera.position.distanceTo(point)};
    entry.body.wakeUp();running.current=true;invalidate();
  }};
  state.engine.current.prepare=prepare;
  state.engine.current.entries=entries;
  state.engine.current.grabAt=(id,point)=>api.current.grab(id,{point,stopPropagation(){},target:{}});
  state.engine.current.grabbing=grabbing;
  state.engine.current.release=()=>{grabbing.current=null;};
  useEffect(()=>{
    if(!state.explosion)return;
    for(const entry of entries.current.values()){const b=entry.body;if(!b)continue;const p=b.translation(),m=b.mass();b.applyImpulse({x:(p.x*.9+(Math.random()-.5)*3)*m,y:(3+Math.random()*3)*m,z:(p.z+1+Math.random()*3)*m},true);b.applyTorqueImpulse({x:(Math.random()-.5)*m*4,y:(Math.random()-.5)*m*3,z:(Math.random()-.5)*m*4},true);}
    running.current=true;invalidate();
  },[state.explosion,invalidate]);
  useEffect(()=>{grabbing.current=null;if(state.creative){for(const e of entries.current.values())e.body?.wakeUp();running.current=true;invalidate();}},[state.creative,invalidate]);
  useEffect(()=>{
    grabbing.current=null;running.current=false;accumulator.current=0;
    for(const entry of entries.current.values()){entry.group.position.set(0,0,0);entry.group.quaternion.identity();if(entry.body){entry.body.setTranslation(entry.center,false);entry.body.setRotation({x:0,y:0,z:0,w:1},false);entry.body.setLinvel({x:0,y:0,z:0},false);entry.body.setAngvel({x:0,y:0,z:0},false);entry.body.resetForces(false);entry.body.resetTorques(false);entry.body.sleep();}}
    invalidate();
  },[state.epoch,invalidate]);
  useEffect(()=>{
    const move=e=>{const grab=grabbing.current;if(!grab||document.pointerLockElement)return;const rect=gl.domElement.getBoundingClientRect();const point=new Vector3((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1,.5).unproject(camera);const ray=point.sub(camera.position).normalize();const denom=grab.plane.normal.dot(ray);if(Math.abs(denom)>.001){const d=-(camera.position.dot(grab.plane.normal)+grab.plane.constant)/denom;grab.target.copy(camera.position).addScaledVector(ray,Math.max(1,Math.min(16,d)));}invalidate();};
    const release=()=>{grabbing.current=null;};
    const wheel=e=>{const grab=grabbing.current;if(!grab)return;e.preventDefault();const direction=new Vector3();camera.getWorldDirection(direction);grab.distance=Math.max(1,Math.min(12,grab.distance+e.deltaY*.006));grab.target.copy(camera.position).addScaledVector(direction,grab.distance);grab.plane.setFromNormalAndCoplanarPoint(direction,grab.target);invalidate();};
    const rotate=e=>{if(e.key.toLowerCase()==='r'&&grabbing.current&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){const b=grabbing.current.entry.body;b.applyTorqueImpulse({x:0,y:b.mass()*1.8,z:e.shiftKey?b.mass():0},true);invalidate();}};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',release);window.addEventListener('blur',release);window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',rotate);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',release);window.removeEventListener('blur',release);window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',rotate);};
  },[camera,gl,invalidate]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;simulation.current?.world.free();simulation.current=null;};},[]);
  useFrame((_,delta)=>{
    const sim=simulation.current;if(!sim||!running.current||document.hidden)return;
    accumulator.current+=Math.min(delta,.05);let steps=0;
    while(accumulator.current>=1/60&&steps<3){
      const grab=grabbing.current;
      if(grab){const b=grab.entry.body;if(document.pointerLockElement){const direction=new Vector3();camera.getWorldDirection(direction);grab.target.copy(camera.position).addScaledVector(direction,grab.distance);}
        const point=grab.local.clone().applyQuaternion(new Quaternion().copy(b.rotation())).add(new Vector3().copy(b.translation())),velocity=new Vector3().copy(b.linvel()).add(new Vector3().copy(b.angvel()).cross(point.clone().sub(new Vector3().copy(b.translation()))));
        const force=grab.target.clone().sub(point).multiplyScalar(40).addScaledVector(new Vector3().copy(velocity),-9).clampLength(0,70).multiplyScalar(b.mass()/60);
        b.applyImpulseAtPoint(force,point,true);
      }
      sim.world.timestep=1/60;sim.world.step();accumulator.current-=1/60;steps++;
    }
    let awake=false;
    for(const entry of entries.current.values()){const b=entry.body;if(!b)continue;entry.group.quaternion.copy(b.rotation());entry.group.position.copy(entry.center).applyQuaternion(entry.group.quaternion).negate().add(new Vector3().copy(b.translation()));if(!b.isSleeping())awake=true;}
    running.current=awake||Boolean(grabbing.current);if(running.current)invalidate();
  });
  return <PhysicsContext.Provider value={api}>{children}</PhysicsContext.Provider>;
}
export function PhysicsObject({id,mass=1,children}){
  const group=useRef(),api=useContext(PhysicsContext),state=useWorld();
  useEffect(()=>{api.current.entries.current.set(id,{group:group.current,mass});return()=>api.current.entries.current.delete(id);},[id,mass,api]);
  return <group ref={group} userData={{physicsId:id}} onPointerDown={e=>{if(state.mode!=='roam')api.current.grab(id,e);}} onClick={e=>{if(state.creative)e.stopPropagation();}}>{children}</group>;
}
