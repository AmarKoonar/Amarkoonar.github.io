"use client";
import { useEffect, useRef, useState } from 'react';
import { Sun, Sunset, Moon, Headphones, Pause, SlidersHorizontal, RotateCcw, Footprints, Scan } from 'lucide-react';
import { atmospheres } from '@/data/atmospheres';
import { useWorld } from './WorldContext';

const moodIcons = { day: Sun, golden: Sunset, night: Moon };
export default function StudioControls({ atmosphere, onAtmosphere, showLabels, onLabels, onRoam, onResetView }) {
  const world = useWorld();
  const [open, setOpen] = useState(false);
  const [audioPending, setAudioPending] = useState(false);
  const tools = useRef(null), toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => { if (!tools.current?.contains(event.target)) setOpen(false); };
    window.addEventListener('pointerdown', dismiss);
    return () => window.removeEventListener('pointerdown', dismiss);
  }, [open]);
  const playing = world.music === 'playing';
  const toggleMusic = async () => {
    setAudioPending(true);
    try {
      const result = await world.musicControl(playing ? 'pause' : 'play');
      if (result.startsWith('Audio could not')) world.setNotice(result);
    } finally { setAudioPending(false); }
  };
  const action = callback => { callback(); setOpen(false); toggle.current?.focus({ preventScroll: true }); };
  return <>
    <aside className="studio-atmosphere" aria-label="Studio atmosphere">
      <span className="studio-control-label">SET THE MOOD</span>
      <div className="mood-options" role="group" aria-label="Lighting">
        {Object.entries(atmospheres).map(([id, mood]) => {
          const Icon = moodIcons[id];
          return <button key={id} onClick={() => onAtmosphere(id)} aria-label={mood.label} title={mood.label} aria-pressed={atmosphere === id}><Icon size={16} /><span>{mood.label}</span></button>;
        })}
        <span className="control-divider" />
        <button className="music-toggle" onClick={toggleMusic} aria-label={playing ? 'Pause studio music' : 'Play studio music'} aria-pressed={playing} disabled={audioPending} title="Desk After Dark">{playing ? <Pause size={15} /> : <Headphones size={16} />}<span>{audioPending ? 'Starting…' : playing ? 'Sound on' : 'Sound off'}</span></button>
      </div>
    </aside>
    <div ref={tools} className="studio-tools" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); toggle.current?.focus({ preventScroll: true }); } }}>
      {open && <div className="studio-tools-panel" id="studio-tools-panel">
        <span className="studio-control-label">MAKE YOURSELF AT HOME</span>
        <button onClick={() => action(onRoam)}><Footprints size={16} />{world.mode === 'roam' ? 'Return to the desk' : 'Walk around'}<span>WASD</span></button>
        <button onClick={onLabels} aria-pressed={showLabels}><Scan size={16} />Object labels<span>{showLabels ? 'On' : 'Off'}</span></button>
        <button onClick={() => action(onResetView)}><RotateCcw size={16} />Reset camera</button>
        <button onClick={() => action(world.reset)}><RotateCcw size={16} />Restore the room</button>
      </div>}
      <button ref={toggle} className="studio-tools-toggle" aria-expanded={open} aria-controls={open ? 'studio-tools-panel' : undefined} onClick={() => setOpen(value => !value)}><SlidersHorizontal size={15} /><span>Room controls</span><span className="tools-indicator">{open ? '−' : '+'}</span></button>
    </div>
  </>;
}
