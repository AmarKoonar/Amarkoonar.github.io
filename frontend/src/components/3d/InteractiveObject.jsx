"use client";
import { useRef, useState, useEffect, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { HoverContext } from './HoverContext';
import { SurfaceContext } from './SurfaceContext';
import { useWorld } from '../workspace/WorldContext';

export default function InteractiveObject({ id, label, position, rotation, labelPosition = [0, 1, 0], active, onSelect, onHoverChange, reducedMotion, children }) {
  const group = useRef();
  const world = useWorld();
  const { focus } = useContext(SurfaceContext);
  const [hovered, setHovered] = useState(false);
  const { gl, invalidate } = useThree();
  useEffect(() => { gl.domElement.style.cursor = hovered ? 'pointer' : 'auto'; invalidate(); return () => { gl.domElement.style.cursor = 'auto'; }; }, [hovered, gl, invalidate]);
  const enabledHover = hovered && !focus && !world.creative && !world.explosion;
  useEffect(() => { onHoverChange?.(enabledHover); }, [enabledHover, onHoverChange]);
  return <group position={position} rotation={rotation} userData={{ interactionId: id }}>
    <group ref={group} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); if (!world.creative) onSelect(id); }}>
      <HoverContext.Provider value={{hovered:enabledHover,reducedMotion}}>{children}</HoverContext.Provider>
      {!focus && world.mode !== 'roam' && !world.creative && <Html position={labelPosition} center zIndexRange={[8, 1]} style={{ pointerEvents: 'none' }}>
        <span className={`object-label ${hovered || active ? 'is-highlighted' : ''}`}><i />{label}<span>↗</span></span>
      </Html>}
    </group>
  </group>;
}
