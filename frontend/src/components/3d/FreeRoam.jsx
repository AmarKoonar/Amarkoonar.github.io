"use client";
import { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Euler, Raycaster, Vector2, Vector3, Quaternion, Matrix4 } from 'three';
import { useWorld } from '../workspace/WorldState';
import { PLAYER, movePlayer } from '@/lib/player.mjs';

export default function FreeRoam({focus,onSelect}){
  const world=useWorld(),{camera,gl,invalidate,scene}=useThree();
  const active=world.mode==='roam'&&!focus;
  const keys=useRef(new Set()), look=useRef(new Euler(0,0,0,'YXZ')), transition=useRef(null), drag=useRef(null), saved=useRef(null), lastActive=useRef(false), selected=useRef(null), hint=useRef(''), highlighted=useRef([]), jump=useRef(false);
  const player=useRef({x:8.4,z:9,feet:PLAYER.floor,velocityY:0,grounded:true});
  const math=useMemo(()=>({ray:new Raycaster(),center:new Vector2(),forward:new Vector3(),right:new Vector3(),move:new Vector3()}),[]);
  const clearHighlight=()=>{for(const item of highlighted.current)item.material.emissive.copy(item.color);highlighted.current=[];};
  useEffect(()=>{
    if(active){
      const resuming=Boolean(saved.current&&world.returnRoam.current);
      if(resuming){camera.position.copy(saved.current.position);camera.quaternion.copy(saved.current.quaternion);world.returnRoam.current=false;player.current={...saved.current.player};}
      else {
        const position=camera.position.clone();position.x=Math.max(-10,Math.min(10,position.x));position.z=Math.max(-9,Math.min(9,position.z));if(Math.abs(position.x)<5.2&&Math.abs(position.z)<2.8)position.z=3.4;position.y=PLAYER.floor+PLAYER.eye;
        const quaternion=new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(position,new Vector3(0,.4,0),new Vector3(0,1,0)));
        transition.current={position,quaternion};player.current={x:position.x,z:position.z,feet:PLAYER.floor,velocityY:0,grounded:true};
      }
      look.current.setFromQuaternion(camera.quaternion,'YXZ');invalidate();
    }else if(lastActive.current){saved.current={position:camera.position.clone(),quaternion:camera.quaternion.clone(),player:{...player.current}};keys.current.clear();clearHighlight();}
    lastActive.current=active;
  },[active,camera,invalidate,world.returnRoam]);
  useEffect(()=>{
    if(!active)return;
    const down=e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift',' '].includes(key)){keys.current.add(key);if(key===' '&&!e.repeat)jump.current=true;e.preventDefault();world.setNotice('');invalidate();}};
    const up=e=>keys.current.delete(e.key.toLowerCase());
    const move=e=>{
      const locked=document.pointerLockElement===gl.domElement;if(!locked&&!drag.current)return;
      const dx=locked?e.movementX:e.clientX-drag.current.x,dy=locked?e.movementY:e.clientY-drag.current.y;
      if(drag.current)drag.current={x:e.clientX,y:e.clientY};
      if(!Number.isFinite(dx)||!Number.isFinite(dy))return;
      look.current.setFromQuaternion(camera.quaternion,'YXZ');look.current.y-=dx*.0025;look.current.x=Math.max(-1.4,Math.min(1.4,look.current.x-dy*.0025));camera.quaternion.setFromEuler(look.current);if(transition.current)transition.current.quaternion.copy(camera.quaternion);invalidate();
    };
    const click=e=>{
      if(e.button!==0&&e.pointerType!=='touch')return;
      if(world.creative){const rect=gl.domElement.getBoundingClientRect();math.ray.setFromCamera(document.pointerLockElement?math.center:new Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);for(const hit of math.ray.intersectObjects(scene.children,true)){let obj=hit.object;while(obj&&!obj.userData.physicsId)obj=obj.parent;if(obj){world.engine.current.grabAt?.(obj.userData.physicsId,hit.point);return;}}}
      if(selected.current&&document.pointerLockElement&&!world.creative){world.returnRoam.current=true;document.exitPointerLock?.();onSelect(selected.current);return;}
      drag.current={x:e.clientX,y:e.clientY};
      if(!document.pointerLockElement&&e.pointerType!=='touch'){try{gl.domElement.requestPointerLock?.()?.catch?.(()=>world.setNotice('Drag to look · WASD move · Shift sprint · Space jump'));}catch{world.setNotice('Drag to look · WASD move · Shift sprint · Space jump');}}
    };
    const release=()=>{drag.current=null;},blur=()=>{keys.current.clear();drag.current=null;};
    const lock=()=>{if(!document.pointerLockElement){keys.current.clear();if(!world.returnRoam.current)world.setMode('cinematic');invalidate();}};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('pointermove',move);gl.domElement.addEventListener('pointerdown',click);window.addEventListener('pointerup',release);window.addEventListener('blur',blur);document.addEventListener('pointerlockchange',lock);
    world.engine.current.moveKey=(key,on)=>{if(key===' '&&on)jump.current=true;on?keys.current.add(key):keys.current.delete(key);invalidate();};
    return()=>{keys.current.clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('pointermove',move);gl.domElement.removeEventListener('pointerdown',click);window.removeEventListener('pointerup',release);window.removeEventListener('blur',blur);document.removeEventListener('pointerlockchange',lock);};
  },[active,camera,gl,invalidate,onSelect,world.creative,world.engine,world.returnRoam,world.setMode,world.setNotice,scene,math]);
  useFrame((_,delta)=>{
    if(!active)return;
    const dt=Math.min(delta,.05),next=transition.current;
    if(next){camera.position.lerp(next.position,1-Math.exp(-5*dt));camera.quaternion.slerp(next.quaternion,1-Math.exp(-5*dt));if(camera.position.distanceTo(next.position)<.015){camera.position.copy(next.position);transition.current=null;}invalidate();}
    else {
      const forward=(keys.current.has('w')||keys.current.has('arrowup')?1:0)-(keys.current.has('s')||keys.current.has('arrowdown')?1:0),side=(keys.current.has('d')||keys.current.has('arrowright')?1:0)-(keys.current.has('a')||keys.current.has('arrowleft')?1:0);
      camera.getWorldDirection(math.forward);math.forward.y=0;math.forward.normalize();math.right.crossVectors(math.forward,new Vector3(0,1,0)).normalize();math.move.copy(math.forward).multiplyScalar(forward).addScaledVector(math.right,side).normalize().multiplyScalar(dt*(keys.current.has('shift')?PLAYER.sprint:PLAYER.walk));
      const boxes=[new Box3(new Vector3(-4.75,-.11,-2.3),new Vector3(4.75,.11,2.3)),...[-4,4].map(x=>new Box3(new Vector3(x-.1,-2.67,-1.85),new Vector3(x+.1,-.1,1.85)))];
      for(const entry of world.engine.current.entries?.current.values()||[])boxes.push(new Box3().setFromObject(entry.group));
      player.current=movePlayer(player.current,math.move,boxes,dt,jump.current);jump.current=false;
      camera.position.set(player.current.x,player.current.feet+PLAYER.eye,player.current.z);
      if(forward||side||!player.current.grounded)invalidate();
    }
    math.ray.setFromCamera(math.center,camera);math.ray.far=7;selected.current=null;
    for(const hit of math.ray.intersectObjects(scene.children,true)){let obj=hit.object,visible=true;while(obj){if(!obj.visible)visible=false;if(obj.userData.interactionId)selected.current=obj.userData.interactionId;obj=obj.parent;}if(!visible){selected.current=null;continue;}if(hit.object.material?.opacity===0)continue;break;}
    const text=selected.current?`${world.creative?'HOLD · Grab':'CLICK · Open'} ${selected.current==='laptop'?'terminal':selected.current}`:'WASD move · Shift sprint · Space jump · drag to look';
    if(hint.current!==text){clearHighlight();if(selected.current)scene.traverse(obj=>{if(obj.userData.interactionId===selected.current)obj.traverse(child=>{if(child.isMesh&&child.material?.emissive){highlighted.current.push({material:child.material,color:child.material.emissive.clone()});child.material.emissive.set('#132a15');}});});hint.current=text;world.engine.current.setInteractionHint?.(text);}
  });
  useEffect(()=>()=>clearHighlight(),[]);
  return null;
}
