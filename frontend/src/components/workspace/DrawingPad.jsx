"use client";
import { useEffect, useRef, useState } from 'react';
import { Pencil, Undo2, Eraser } from 'lucide-react';
import { useWorld } from './WorldState';
export default function DrawingPad(){
  const world=useWorld(),[color,setColor]=useState('#30463c'),[,redraw]=useState(0),stroke=useRef(null),pad=useRef(null);
  useEffect(()=>{if(!world.drawing)return;const page=pad.current?.closest('.page-content');if(page&&pad.current.getBoundingClientRect().bottom>page.getBoundingClientRect().bottom)page.scrollTo({top:page.scrollHeight-page.clientHeight,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[world.drawing]);
  const point=e=>{const rect=e.currentTarget.getBoundingClientRect();return `${Math.round((e.clientX-rect.left)/rect.width*1000)},${Math.round((e.clientY-rect.top)/rect.height*450)}`;};
  const stop=()=>{stroke.current=null;};
  return <div ref={pad} className={`drawing-pad ${world.drawing?'drawing-active':''}`}>
    <div className="drawing-tools"><button className="drawing-toggle" aria-pressed={world.drawing} onClick={()=>world.setDrawing(!world.drawing)}><Pencil size={15}/>{world.drawing?'Put pen down':'Pick up the pen'}</button>{world.drawing&&<><div className="ink-colors">{[['#30463c','Forest'],['#b35f43','Terracotta'],['#345b88','Blue']].map(([ink,name])=><button key={ink} aria-label={`${name} ink`} aria-pressed={color===ink} style={{background:ink}} onClick={()=>setColor(ink)}/>)}</div><button aria-label="Undo stroke" onClick={()=>{world.ink.current.pop();redraw(n=>n+1);}}><Undo2 size={15}/></button><button aria-label="Clear drawing" onClick={()=>{world.ink.current=[];redraw(n=>n+1);}}><Eraser size={15}/></button></>}</div>
    <svg viewBox="0 0 1000 450" preserveAspectRatio="none" role="img" aria-label="Drawing area at the bottom of the notebook" onPointerDown={e=>{if(!world.drawing)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);stroke.current={color,points:[point(e)]};world.ink.current.push(stroke.current);redraw(n=>n+1);}} onPointerMove={e=>{if(!stroke.current||!world.drawing)return;stroke.current.points.push(point(e));redraw(n=>n+1);}} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>
      <defs><pattern id="notebook-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="1" fill="#536b4433"/></pattern></defs><rect width="1000" height="450" fill="url(#notebook-dots)"/>
      {world.ink.current.map((line,i)=>line.points.length===1?<circle key={i} cx={line.points[0].split(',')[0]} cy={line.points[0].split(',')[1]} r="3" fill={line.color}/>:<polyline key={i} points={line.points.join(' ')} fill="none" stroke={line.color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>)}
    </svg>
    {!world.drawing&&!world.ink.current.length&&<span className="drawing-invitation">A little room for your ideas.<br/>Click the pen beside the page to draw.</span>}
  </div>;
}
