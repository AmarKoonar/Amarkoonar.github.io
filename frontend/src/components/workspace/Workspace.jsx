"use client";
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, BookOpen, FileText, TerminalSquare, Home, Laptop, Mail, Monitor, RotateCcw, X } from 'lucide-react';
import { chapters, chapterIndex } from '@/data/workspace';
import { WorldProvider, useWorld } from './WorldContext';

const Scene = dynamic(() => import('../3d/Scene'), { ssr: false, loading: () => null });
const icons = [Home, Laptop, BookOpen, Monitor, FileText, Mail];
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function Workspace(props) { return <WorldProvider><WorkspaceInner {...props} /></WorldProvider>; }
function WorkspaceInner({ content }) {
  const world = useWorld();
  const [interactionHint,setInteractionHint] = useState('');
  world.engine.current.setInteractionHint = setInteractionHint;
  const [enhanced, setEnhanced] = useState(false);
  const [reading, setReading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState('home');
  const [focus, setFocus] = useState(null);
  const [focusReady, setFocusReady] = useState(false);
  const panel = Boolean(focus);
  const onFocusReady = useCallback((id) => setFocusReady(Boolean(id)), []);
  const progress = useRef(0), timeline = useRef(), lastFocus = useRef(), activeIndex = useRef(0);
  const readyScene = useCallback(() => setReady(true), []);
  const failScene = useCallback(() => { setFailed(true); setReading(true); setEnhanced(true); window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const update = () => { setMobile(mobileQuery.matches); setReducedMotion(motionQuery.matches); };
    update(); setReading(motionQuery.matches); setEnhanced(true);
    motionQuery.addEventListener('change', update); mobileQuery.addEventListener('change', update);
    try { const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl2'); if (!gl) failScene(); else gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch { failScene(); }
    return () => { window.history.scrollRestoration = previousScrollRestoration; motionQuery.removeEventListener('change', update); mobileQuery.removeEventListener('change', update); };
  }, [failScene]);
  useEffect(() => {
    if (!enhanced || reading) return;
    const onScroll = () => {
      if (world.mode !== 'cinematic' || world.creative) return;
      const max = (timeline.current?.offsetHeight || 0) - window.innerHeight;
      progress.current = max > 0 ? Math.max(0, Math.min(5, window.scrollY / max * 5)) : 0;
      const nextIndex = Math.round(progress.current);
      if (nextIndex !== activeIndex.current) { setFocus(null); setFocusReady(false); activeIndex.current = nextIndex; }
      setActive(chapters[nextIndex].id);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [enhanced, reading, world.mode, world.creative]);
  useEffect(() => { if (reading || ready) return; const timer = setTimeout(failScene, 25000); return () => clearTimeout(timer); }, [reading, ready, failScene]);
  const select = useCallback((id, open = true) => {
    lastFocus.current = document.activeElement;
    if (world.mode === 'roam') { world.returnRoam.current = true; world.setMode('focus'); document.exitPointerLock?.(); }
    const target = id === 'featured' ? 'projects' : id;
    if (open && target === focus) return;
    const idx = chapterIndex(target === 'laptop' ? 'projects' : target);
    activeIndex.current = idx;
    setFocusReady(false); setFocus(open && target !== 'home' ? target : null); setActive(chapters[idx].id);
    const max = (timeline.current?.offsetHeight || 0) - window.innerHeight;
    progress.current = idx; window.scrollTo({ top: Math.max(0, max) * idx / 5, behavior: 'instant' });
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [focus, world.mode, world.setMode, world.returnRoam]);
  const close = useCallback(() => { setFocus(null); setFocusReady(false); world.setProgram(null); if (world.returnRoam.current) world.setMode('roam'); lastFocus.current?.focus?.({ preventScroll: true }); }, [world.setProgram, world.setMode, world.returnRoam]);
  const resetView = () => { world.setMode('cinematic'); world.returnRoam.current=false; document.exitPointerLock?.(); select('home', false); world.setMode('cinematic'); };
  world.bridge.current = { close, resetView, overview: resetView };
  useEffect(()=>{if(world.mode !== 'roam')return;const timer=setTimeout(()=>world.setNotice(n=>n.startsWith('FREE ROAM —')?'':n),6500);return()=>clearTimeout(timer);},[world.mode,world.setNotice]);
  const toggleRoam = () => { if(world.mode === 'roam') { resetView(); return; } setFocus(null); setFocusReady(false); world.setProgram(null); world.setMode('roam'); world.setNotice('FREE ROAM — WASD move · Shift sprint · Space jump · mouse look · Esc exits.'); };
  useEffect(() => {
    const escape = (e) => { if (e.key !== 'Escape' || e.defaultPrevented) return; if(world.program) { world.setProgram(null); return; } if(panel) close(); else if(world.creative) { world.setCreative(false); world.engine.current.release?.(); world.setNotice('Creative mode ended.'); } else if(world.mode === 'roam') { world.setMode('cinematic'); document.exitPointerLock?.(); world.setNotice(''); } };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, [panel, close, world.program, world.mode, world.creative, world.setProgram, world.setMode, world.setCreative, world.setNotice, world.engine]);
  useEffect(() => {
    if (!focus && world.mode === 'cinematic' && !world.creative) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [focus, world.mode, world.creative]);
  const toggleReading = () => { world.reset(); setReading(!reading); setFocus(null); setFocusReady(false); window.scrollTo(0, 0); };
  const current = chapters[chapterIndex(active)], immersive = enhanced && !reading;
  return <>
    <a className="skip-link" href="#portfolio-content" onClick={() => setReading(true)}>Skip to portfolio content</a>
    {enhanced && <header className="site-header"><button className="wordmark" onClick={() => { if (reading) window.scrollTo(0, 0); else select('home', false); }} aria-label="Amar Koonar, back to the desk">ak<span>.</span></button><div className="header-identity"><strong>AMAR KOONAR</strong></div><div className="header-right"><span className="sfu-note"><i /> COMPUTER SCIENCE @ SFU</span><button className="view-switch" onClick={toggleReading} disabled={failed}>{reading ? failed ? 'Reading view' : 'Explore in 3D ↗' : 'Reading view ↗'}</button></div></header>}
    <div id="portfolio-content" hidden={immersive} className={enhanced ? 'reading-wrapper' : ''}>{failed && <p className="fallback-notice" role="status">The 3D workspace is unavailable on this device. All of my work is right here.</p>}{content}</div>
    {immersive && <main ref={timeline} className="workspace-timeline"><div className={`workspace-stage ${mobile ? 'is-mobile' : ''} ${panel ? 'has-panel' : ''} ${world.mode === 'roam' || world.creative ? 'world-exploring' : ''}`}>
      <div className="scene-canvas" aria-label="Interactive 3D workstation. Use the section navigation for keyboard access."><SceneBoundary onFailure={failScene}><Scene progress={progress} active={active} focus={focus} focusReady={focusReady} onFocusReady={onFocusReady} reducedMotion={reducedMotion} mobile={mobile} onSelect={select} onReady={readyScene} onFailure={failScene} /></SceneBoundary></div>
      <div className="scene-vignette" />
      {!ready && <div className="loading-note" role="status"><span className="loading-dot" />Setting the desk…<button onClick={toggleReading}>Read the portfolio instead ↗</button></div>}
      {!panel && world.mode === 'cinematic' && !world.creative && !world.coffee && !world.explosion && <div className={`chapter-intro ${active === 'home' ? 'is-home' : ''}`} key={active}>
        <h1>{active === 'home' ? 'Hi, I’m Amar.' : current.heading}</h1>
        <button className="primary-action" onClick={() => select(active === 'home' ? 'projects' : active)}>{active === 'home' ? 'Explore my work' : `Open ${current.label.toLowerCase()}`}<ArrowUpRight size={17} /></button>
      </div>}
      {panel && <button className="leave-object" onClick={close}><X size={16} /><span>Back to the desk</span><kbd>Esc</kbd></button>}
      {world.notice && !panel && <div className="world-notice" role="status">{world.notice}<button aria-label="Dismiss notice" onClick={()=>world.setNotice('')}>×</button></div>}
      {world.creative && <div className="creative-badge">CREATIVE MODE • ON <button onClick={()=>{world.setCreative(false);world.engine.current.release?.();world.setNotice('');}}>Exit</button></div>}
      {world.mode === 'roam' && !panel && <><div className="roam-reticle">+</div><div className="roam-hint">{interactionHint}</div>{mobile && <div className="roam-touch">{[['a','←'],['w','↑'],['s','↓'],['d','→'],[' ','Jump'],['shift','Sprint']].map(([key,label])=><button key={key} aria-label={`Move ${key}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);world.engine.current.moveKey?.(key,true);}} onPointerUp={()=>world.engine.current.moveKey?.(key,false)} onPointerCancel={()=>world.engine.current.moveKey?.(key,false)}>{label}</button>)}</div>}</>}
      <div className="scene-caption"><span className="crosshair">+</span><span>{active === 'home' ? 'THE DESK / A WORK IN PROGRESS' : current.object.toUpperCase()}</span></div>
      <aside className="chapter-rail" aria-label="Chapter progress">{chapters.map((chapter, i) => <button key={chapter.id} onClick={() => select(chapter.id, false)} aria-label={`Go to ${chapter.label}`} aria-current={active === chapter.id ? 'step' : undefined}><span>{String(i).padStart(2, '0')}</span><i /></button>)}</aside>
      <footer className="workspace-footer"><div className="scroll-hint"><ArrowDown size={15} /><span>SCROLL TO EXPLORE<small>{String(chapterIndex(active)).padStart(2, '0')} — 05</small></span></div><nav className="desk-dock" aria-label="Workspace sections">{chapters.map((chapter, i) => { const Icon = icons[i]; return <button key={chapter.id} onClick={() => select(chapter.id)} className={active === chapter.id && focus !== 'laptop' ? 'active' : ''} aria-label={chapter.label} aria-current={active === chapter.id && focus !== 'laptop' ? 'page' : undefined}><Icon size={18} strokeWidth={1.5} /><span>{chapter.label}</span></button>; })}<button onClick={() => select('laptop')} className={focus === 'laptop' ? 'active' : ''} aria-label="Terminal" aria-current={focus === 'laptop' ? 'page' : undefined}><TerminalSquare size={18} strokeWidth={1.5} /><span>Terminal</span></button></nav><div className="camera-controls"><button className={world.mode === 'roam' ? 'is-on' : ''} onClick={toggleRoam}>FREE ROAM{world.mode === 'roam' ? ' • ON' : ''}</button><button onClick={resetView}><RotateCcw size={14} /> RESET VIEW</button><button onClick={world.reset} title="Restore all objects, programs and effects">RESET WORLD</button></div></footer>
    </div></main>}
  </>;
}
