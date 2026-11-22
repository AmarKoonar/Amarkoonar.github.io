"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasTexture, Object3D, Color, Vector3, SRGBColorSpace } from 'three';
import { buildings, blocked, stepPlayer } from '@/lib/city.mjs';

const palette=['#36f4e8','#ff438b','#ffb74b'];
function Block({position,size,color='#172533',glow=false,...props}) {
  return <mesh position={position} {...props}><boxGeometry args={size}/>{glow?<meshBasicMaterial color={color}/>:<meshStandardMaterial color={color} roughness={.72} metalness={.08}/>}</mesh>;
}
function Sign({text,color,position,rotation=[0,0,0],size=[7,2]}) {
  const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle='#07101d';c.fillRect(0,0,1024,256);c.strokeStyle=color;c.lineWidth=8;c.strokeRect(8,8,1008,240);c.fillStyle=color;c.font='bold 100px monospace';c.textAlign='center';c.textBaseline='middle';c.shadowColor=color;c.shadowBlur=18;c.fillText(text,512,128,970);const t=new CanvasTexture(canvas);t.colorSpace=SRGBColorSpace;return t;},[text,color]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={position} rotation={rotation}><planeGeometry args={size}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
function Windows() {
  const ref=useRef();
  const windows=useMemo(()=>{const a=[];buildings.forEach((b,i)=>{for(let y=4;y<b.h-2;y+=3)for(let n=-2;n<=2;n++){if((i+n+y)%5===0)continue;for(let side=0;side<4;side++)a.push({p:side<2?[b.x+n*2.5,y,b.z+(side===0?1:-1)*(b.d/2+.015)]:[b.x+(side===2?1:-1)*(b.w/2+.015),y,b.z+n*2.5],r:side<2?0:Math.PI/2,c:(i+n+y)%3?palette[b.tone]:'#667e98'});}});return a;},[]);
  useEffect(()=>{const o=new Object3D();windows.forEach((w,i)=>{o.position.set(...w.p);o.rotation.set(0,w.r,0);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);ref.current.setColorAt(i,new Color(w.c).multiplyScalar(.5));});ref.current.instanceMatrix.needsUpdate=true;ref.current.instanceColor.needsUpdate=true;},[windows]);
  return <instancedMesh ref={ref} args={[null,null,windows.length]}><boxGeometry args={[.85,1.2,.035]}/><meshBasicMaterial/></instancedMesh>;
}
function City() {
  return <>
    <color attach="background" args={['#070d1b']}/><fog attach="fog" args={['#10162b',35,145]}/>
    <ambientLight intensity={1.8} color="#b6c6e8"/><hemisphereLight args={['#687baf','#52606c',2.2]}/><directionalLight position={[-30,80,20]} intensity={2} color="#718dba"/>
    <Block position={[0,-.2,0]} size={[225,.4,225]} color="#293745"/>
    {Array.from({length:7},(_,i)=>(i-3)*30).map(n=><group key={n}>
      <Block position={[n,.007,0]} size={[.12,.01,216]} color="#aaa16f" glow/><Block position={[0,.008,n]} size={[216,.01,.12]} color="#aaa16f" glow/>
      {Array.from({length:15},(_,j)=>(j-7)*14).map(k=><group key={k}><Block position={[n-3,.011,k]} size={[.08,.01,3]} color="#566876"/><Block position={[k,.012,n+3]} size={[3,.01,.08]} color="#566876"/></group>)}
    </group>)}
    {buildings.map((b,i)=><group key={i}>
      <Block position={[b.x,.08,b.z]} size={[b.w+1,.16,b.d+1]} color="#27323e"/>
      <Block position={[b.x,b.h/2,b.z]} size={[b.w,b.h,b.d]} color={['#35485a','#423d56','#354d51'][b.tone]}/>
      <Block position={[b.x,b.h+.3,b.z]} size={[b.w+.4,.6,b.d+.4]} color="#2c394e"/>
      <Block position={[b.x-b.w/2-.02,b.h/2,b.z-b.d/2]} size={[.12,b.h,.14]} color={palette[b.tone]} glow/>
      <Block position={[b.x,2.8,b.z-b.d/2-.07]} size={[b.w*.8,.09,.1]} color={palette[b.tone]} glow/>
      <Block position={[b.x,1.25,b.z-b.d/2-.05]} size={[2,2.5,.08]} color="#08151e"/>
      <Block position={[b.x+2,1.5,b.z-b.d/2-.06]} size={[.4,.8,.1]} color={palette[b.tone]} glow/>
      <Sign text={['NOVA / 24','夜 CITY','AFTER HOURS','KŌRI','ARCADE','NEURAL','RAMEN 08'][i%7]} color={palette[b.tone]} position={[b.x,5,b.z-b.d/2-.12]} rotation={[0,Math.PI,0]}/>
      <Sign text={['NOVA / 24','NIGHT MARKET','SYNTH LAB','KŌRI','ARCADE','NEURAL','RAMEN 08'][i%7]} color={palette[b.tone]} position={[b.x-b.w/2-.12,4.5,b.z]} rotation={[0,-Math.PI/2,0]}/>
      <Block position={[b.x-b.w/2-.7,2.9,b.z]} size={[1.4,.16,7]} color={palette[b.tone]}/>
      <Block position={[b.x-b.w/2-.03,1.5,b.z]} size={[.05,2.5,6]} color="#0a1924"/>
      {[-2,0,2].map(n=><Block key={n} position={[b.x-b.w/2-.06,1.4,b.z+n]} size={[.03,1.9,.06]} color={palette[b.tone]} glow/>)}
      <Block position={[b.x-b.w/2-.3,.4,b.z+5]} size={[.5,.8,1.3]} color="#466274"/>
      {i%4===0&&<Sign text="夜" color="#ff438b" position={[b.x-b.w/2-.12,9,b.z-2]} rotation={[0,-Math.PI/2,0]} size={[3,7]}/>}
      <Block position={[b.x,b.h+2,b.z]} size={[b.w*.3,4,b.d*.35]} color="#243044"/>
    </group>)}
    <Windows/>
    {[-60,-30,0,30,60].map(z=><group key={z} position={[-5,0,z]}><Block position={[0,2.5,0]} size={[.12,5,.12]} color="#516176"/><Block position={[.8,5,0]} size={[1.7,.12,.35]} color="#66f4e2" glow/><pointLight position={[1,4.7,0]} intensity={25} distance={13} color="#36f4e8"/></group>)}
    <Sign text="REALITY // 01" color="#42fae9" position={[0,9,-24]} size={[14,3]}/>
    <Block position={[-7,4.5,-24]} size={[.3,9,.3]}/><Block position={[7,4.5,-24]} size={[.3,9,.3]}/>
    <Traffic/>
    <mesh position={[-60,75,-100]}><sphereGeometry args={[8,24,24]}/><meshBasicMaterial color="#a3cbd5"/></mesh>
  </>;
}
function Traffic() {
  const refs=useRef([]);
  useFrame(({clock})=>{refs.current.forEach((r,i)=>{if(r)r.position.z=((clock.elapsedTime*(i%2?8:-7)+i*48+1000)%200)-100;});});
  return Array.from({length:6},(_,i)=><group key={i} ref={r=>refs.current[i]=r} position={[i%2?-32:32,8+i%3*3,0]}><Block size={[1.8,.45,3.5]} color="#324b64"/><Block position={[0,.4,0]} size={[1.4,.5,1.8]} color="#0e2536"/><Block position={[0,-.25,0]} size={[1.65,.05,3]} color={palette[i%3]} glow/><Block position={[0,0,1.8]} size={[1.4,.15,.04]} color="#ff557d" glow/></group>);
}
function Avatar({body,limbs}) {
  return <group ref={body} rotation={[0,Math.PI,0]}>
    <Block position={[0,1.18,0]} size={[.6,.65,.32]} color="#6b8799"/>
    <Block position={[0,.81,0]} size={[.65,.25,.38]} color="#162532"/>
    <Block position={[0,1.2,-.19]} size={[.38,.48,.17]} color="#0b192c"/>
    <Block position={[0,1.3,-.285]} size={[.25,.035,.02]} color="#3ffff2" glow/>
    <mesh position={[0,1.75,0]}><sphereGeometry args={[.25,16,12]}/><meshStandardMaterial color="#293a4b" metalness={.7} roughness={.3}/></mesh>
    <Block position={[0,1.76,.22]} size={[.37,.09,.04]} color="#ff5c9d" glow/>
    {[-1,1].map((s,i)=><group key={s}>
      <group ref={r=>limbs.current[i]=r} position={[s*.19,.78,0]}><Block position={[0,-.27,0]} size={[.21,.54,.24]} color="#526075"/><Block position={[0,-.61,.07]} size={[.23,.14,.4]} color="#0c1824"/><Block position={[0,-.61,.28]} size={[.23,.035,.03]} color="#3ffff2" glow/></group>
      <group ref={r=>limbs.current[i+2]=r} position={[s*.4,1.45,0]}><Block position={[0,-.3,0]} size={[.19,.6,.22]} color="#5c7e92"/><Block position={[0,-.62,0]} size={[.18,.15,.18]} color="#101c2a"/></group>
    </group>)}
  </group>;
}
function Player({controls,stats,mapDot,reducedMotion}) {
  const {camera,gl}=useThree(),body=useRef(),shadow=useRef(),limbs=useRef([]),state=useRef({x:0,z:6,y:0,vx:0,vz:0,vy:0}),view=useRef({yaw:.2,pitch:.18,distance:7}),phase=useRef(0),initial=useRef(true);
  const scratch=useMemo(()=>({target:new Vector3(),desired:new Vector3(),sample:new Vector3()}),[]);
  useEffect(()=>{
    const keys=controls.current;let drag=null;
    const down=e=>{if(e.target instanceof HTMLElement&&e.target.closest('button'))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift',' '].includes(k)){e.preventDefault();if(k===' '&&!keys[' '])keys.jump=true;keys[k]=true;}};
    const up=e=>{keys[e.key.toLowerCase()]=false;};const clear=()=>{Object.keys(keys).forEach(k=>keys[k]=false);drag=null;};
    const start=e=>{drag={x:e.clientX,y:e.clientY};gl.domElement.setPointerCapture(e.pointerId);};
    const move=e=>{if(!drag)return;view.current.yaw-=(e.clientX-drag.x)*.005;view.current.pitch=Math.max(-.08,Math.min(1.1,view.current.pitch+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};};
    const end=()=>{drag=null;};const wheel=e=>{e.preventDefault();view.current.distance=Math.max(2.5,Math.min(10,view.current.distance+e.deltaY*.006));};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
    const el=gl.domElement;el.addEventListener('pointerdown',start);el.addEventListener('pointermove',move);el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('wheel',wheel,{passive:false});
    return()=>{clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);el.removeEventListener('pointerdown',start);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',end);el.removeEventListener('pointercancel',end);el.removeEventListener('wheel',wheel);};
  },[controls,gl]);
  useFrame((_,delta)=>{
    if(document.hidden)return;
    const dt=Math.min(delta,.04),k=controls.current,p=state.current,v=view.current;
    const forward=Number(!!(k.w||k.arrowup))-Number(!!(k.s||k.arrowdown)),right=Number(!!(k.d||k.arrowright))-Number(!!(k.a||k.arrowleft));
    stepPlayer(p,{x:right*Math.cos(v.yaw)-forward*Math.sin(v.yaw),z:-right*Math.sin(v.yaw)-forward*Math.cos(v.yaw),sprint:k.shift,jump:k.jump},dt);k.jump=false;
    const speed=Math.hypot(p.vx,p.vz),grounded=p.y===0;phase.current+=speed*dt*2.5;
    body.current.position.set(p.x,p.y+(grounded&&!reducedMotion?Math.sin(phase.current*2)*Math.min(speed*.007,.035):0),p.z);
    shadow.current.position.set(p.x,.02,p.z);shadow.current.scale.setScalar(1-p.y*.15);
    if(speed>.15){const target=Math.atan2(p.vx,p.vz),difference=Math.atan2(Math.sin(target-body.current.rotation.y),Math.cos(target-body.current.rotation.y));body.current.rotation.y+=difference*(1-Math.exp(-14*dt));}
    const stride=grounded?Math.sin(phase.current)*Math.min(speed*.11,.75):.2;
    limbs.current.forEach((l,i)=>{l.rotation.x=stride*(i===0||i===3?1:-1);});
    scratch.target.set(p.x,p.y+1.3,p.z);scratch.desired.set(p.x+Math.sin(v.yaw)*Math.cos(v.pitch)*v.distance,p.y+1.7+Math.sin(v.pitch)*v.distance,p.z+Math.cos(v.yaw)*Math.cos(v.pitch)*v.distance);
    for(let t=.08;t<=1;t+=.04){scratch.sample.lerpVectors(scratch.target,scratch.desired,t);if(blocked(scratch.sample.x,scratch.sample.z,.25,scratch.sample.y)){scratch.desired.lerpVectors(scratch.target,scratch.desired,Math.max(.04,t-.06));break;}}
    if(!reducedMotion&&grounded)scratch.desired.y+=Math.sin(phase.current)*Math.min(speed*.005,.025);
    camera.position.lerp(scratch.desired,initial.current?1:1-Math.exp(-10*dt));initial.current=false;camera.lookAt(scratch.target);
    if(mapDot.current){mapDot.current.setAttribute('cx',p.x);mapDot.current.setAttribute('cy',p.z);}
    if(stats.current){stats.current.textContent=`${p.x.toFixed(0)} : ${p.z.toFixed(0)}  /  ${!grounded?'AIRBORNE':speed>5?'SPRINT':speed>.2?'WALK':'IDLE'}`;}
  });
  return <><Avatar body={body} limbs={limbs}/><mesh ref={shadow} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.5,24]}/><meshBasicMaterial color="#020710" transparent opacity={.4} depthWrite={false}/></mesh></>;
}
class CityBoundary extends Component {
  state={error:false};static getDerivedStateFromError(){return {error:true};}
  render(){return this.state.error?<div className="reality-loading">City rendering is unavailable on this device. Use Return to workspace.</div>:this.props.children;}
}
function CityLifecycle({onLost}) {
  const {gl}=useThree();
  useEffect(()=>{const lost=e=>{e.preventDefault();onLost(true);};gl.domElement.addEventListener('webglcontextlost',lost);return()=>gl.domElement.removeEventListener('webglcontextlost',lost);},[gl,onLost]);
  return null;
}
export default function Reality({onExit,reducedMotion}) {
  const controls=useRef({}),stats=useRef(),mapDot=useRef(),[lost,setLost]=useState(false);
  return <main className="reality" aria-label="Reality: explorable cyberpunk city">
    <CityBoundary>{!lost&&<Canvas dpr={[1,1.5]} camera={{fov:58,near:.08,far:240}} gl={{antialias:true,powerPreference:'high-performance'}}><City/><Player controls={controls} stats={stats} mapDot={mapDot} reducedMotion={reducedMotion}/><CityLifecycle onLost={setLost}/></Canvas>}</CityBoundary>
    {lost&&<div className="reality-loading">Graphics connection lost. Return to the workspace to reconnect.</div>}
    <header className="reality-header"><div><span>PORTFOLIO OS / REALITY.EXE</span><h1>NIGHT DISTRICT<span>01</span></h1></div><button onClick={onExit}>Return to workspace <kbd>Esc</kbd></button></header>
    <div className="reality-status"><i/> CONNECTION LIVE <span ref={stats}>0 : 6 / IDLE</span></div>
    <aside className="reality-map" aria-label="City street map"><svg viewBox="-110 -110 220 220">{buildings.map((b,i)=><rect key={i} x={b.x-b.w/2} y={b.z-b.d/2} width={b.w} height={b.d} fill="#34465e"/>)}<circle ref={mapDot} cx="0" cy="6" r="4" fill="#55ffdf"/></svg><span>NEON GRID / YOU ●</span></aside>
    <footer className="reality-help"><span><b>W A S D</b> Move</span><span><b>SHIFT</b> Sprint</span><span><b>SPACE</b> Jump</span><span><b>DRAG</b> Look around</span><span><b>SCROLL</b> Camera distance</span></footer>
    <div className="reality-touch">{[['w','↑'],['a','←'],['s','↓'],['d','→'],['shift','Sprint'],[' ','Jump']].map(([key,label])=><button key={key} aria-label={label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current[key]=true;if(key===' ')controls.current.jump=true;}} onPointerUp={()=>controls.current[key]=false} onPointerCancel={()=>controls.current[key]=false}>{label}</button>)}</div>
  </main>;
}
