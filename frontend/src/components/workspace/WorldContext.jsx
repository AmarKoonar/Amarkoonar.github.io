"use client";
import { useEffect, useRef, useState } from 'react';
import { WorldContext } from './WorldState';
export { useWorld } from './WorldState';
import resumeText from '@/data/resume.json';
import { createShell } from '@/lib/terminal.mjs';
import { about, languages, technologies } from '@/data/workspace';
import { projects, contacts, coursework } from '@/data/portfolio';
export function WorldProvider({ children }) {
  const [mode,setMode]=useState('cinematic'), [creative,setCreative]=useState(false), [coffee,setCoffee]=useState(0), [epoch,setEpoch]=useState(0), [explosion,setExplosion]=useState(0), [program,setProgram]=useState(null), [notice,setNotice]=useState(''), [music,setMusic]=useState('stopped'), [volume,setVolume]=useState(35);
  const [drawing,setDrawing]=useState(false);
  const ink=useRef([]), generation=useRef(0), audioGeneration=useRef(0);
  const bridge=useRef({}), engine=useRef({}), audio=useRef(null), shell=useRef(null), returnRoam=useRef(false), timer=useRef(null);
  if(!shell.current) shell.current=createShell({about,languages,technologies,projects,contacts,coursework,resumeText});
  const log=(text)=>{shell.current.output.push({text});if(shell.current.output.length>150)shell.current.output.splice(0,shell.current.output.length-150);};
  const musicControl=async(action,args=[])=>{
    const request=audioGeneration.current;
    if(action==='volume'){const n=Number(args[0]);if(args[0]===undefined||!Number.isFinite(n)||n<0||n>100)return 'music: volume must be 0–100';setVolume(n);if(audio.current)audio.current.gain.gain.value=n/100;return `Volume: ${n}%`;}
    if(action==='stop'||action==='pause'){audioGeneration.current++;if(audio.current){audio.current.element.pause();if(action==='stop')audio.current.element.currentTime=0;}setMusic(action==='stop'?'stopped':'paused');return 'STATUS: '+(action==='stop'?'STOPPED':'PAUSED');}
    if(!['resume','play'].includes(action))return 'music: use pause, resume, stop, or volume 0–100';
    try{
      if(!audio.current){const element=new Audio('/audio/desk-after-dark.wav');element.loop=true;const ctx=new (window.AudioContext||window.webkitAudioContext)();const source=ctx.createMediaElementSource(element),panner=ctx.createPanner(),gain=ctx.createGain();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=5;panner.rolloffFactor=.4;gain.gain.value=volume/100;source.connect(panner).connect(gain).connect(ctx.destination);audio.current={element,ctx,panner,gain};}
      await audio.current.ctx.resume();if(request!==audioGeneration.current)return '';await audio.current.element.play();if(request!==audioGeneration.current){audio.current.element.pause();return '';}setMusic('playing');return 'SOURCE: laptop\nSTATUS: PLAYING\n♪ Now playing: Desk After Dark';
    }catch{return 'Audio could not start. Use the player’s Play button to try again.';}
  };
  const reset=()=>{generation.current++;setDrawing(false);ink.current=[];clearTimeout(timer.current);setEpoch(n=>n+1);setCoffee(0);setExplosion(0);setCreative(false);setMode('cinematic');setProgram(null);returnRoam.current=false;musicControl('stop');document.exitPointerLock?.();bridge.current.resetView?.();setNotice('Workspace restored.');};
  const run=async(action,args=[])=>{
    const request=generation.current;
    if(action==='reset'){reset();return '';}
    if(action==='exit'){bridge.current.close?.();return '';}
    if(action==='oldsite'){await musicControl('stop');document.exitPointerLock?.();window.location.assign('/classic/');return 'Opening the original portfolio...';}
    if(action==='snake'){setProgram('snake');return 'Executing snake.exe · Escape returns to the terminal.';}
    if(action==='music'||action==='music-control'){if(action==='music')setProgram('music');return musicControl(action==='music'?'play':args[0]||'play',args.slice(1));}
    if(['explode','creative'].includes(action)){setNotice('Preparing physics…');try{await engine.current.prepare?.();}catch{setNotice('Physics could not load. Please try again.');return 'Physics could not load. Please try again.';}if(request!==generation.current)return '';setCreative(action==='creative');if(action==='explode')setExplosion(n=>n+1);bridge.current.overview?.();setNotice(action==='creative'?'CREATIVE MODE • ON — hold and drag to grab · wheel to move closer/further · R to rotate · release to throw':'Desktop chaos. Reset World puts everything back.');return action==='creative'?'Creative mode active.':'Impulse applied to all desk objects.';}
    if(action==='coffee'){setCoffee(n=>n+1);bridge.current.overview?.();setNotice('BREWING…  ████████████████████ 100%');clearTimeout(timer.current);timer.current=setTimeout(()=>{setNotice('COFFEE OVERFLOW DETECTED. This was probably a bad idea.');log('WARNING: CONTAINER CAPACITY EXCEEDED\nCOFFEE OVERFLOW DETECTED.\nthis was probably a bad idea.\nProcess exited with code 0.');},6000);return 'BREWING...\n████████████████████ 100%\nWARNING: CONTAINER CAPACITY EXCEEDED';}
    return '';
  };
  useEffect(()=>()=>{clearTimeout(timer.current);audio.current?.element.pause();audio.current?.ctx.close();},[]);
  return <WorldContext.Provider value={{drawing,setDrawing,ink,mode,setMode,creative,setCreative,coffee,epoch,explosion,program,setProgram,notice,setNotice,music,volume,musicControl,run,reset,bridge,engine,audio,shell,returnRoam,log}}>{children}</WorldContext.Provider>;
}
