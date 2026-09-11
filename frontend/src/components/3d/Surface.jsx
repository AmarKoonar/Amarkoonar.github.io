"use client";
import { useContext, useLayoutEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

import { SurfaceContext } from './SurfaceContext';
import { WorldContext, useWorld } from '../workspace/WorldState';

// Content and camera share the same physical anchor, including parent rotations.
export default function Surface({ id, label, size, position, rotation, children, tone = 'paper' }) {
  const world = useWorld();
  const anchor = useRef();
  const focusContent = useCallback((element) => element?.focus({ preventScroll: true }), []);
  const { surfaces, focus, focusReady, mobile } = useContext(SurfaceContext);
  const { invalidate } = useThree();
  const point = useMemo(() => new Vector3(), []);
  const [pixels, setPixels] = useState({ width: 600, height: 400 });
  const [width, height] = size;
  const visible = focus === id && focusReady;

  useFrame(({ camera, size }) => {
    if (focus !== id || !anchor.current) return;
    anchor.current.getWorldPosition(point);
    const distance = camera.position.distanceTo(point);
    const scale = size.height / (2 * Math.tan(camera.fov * Math.PI / 360) * distance);
    const nextWidth = Math.round(width * scale / 2) * 2;
    const nextHeight = Math.round(height * scale / 2) * 2;
    if (Math.abs(pixels.width - nextWidth) > 1 || Math.abs(pixels.height - nextHeight) > 1) setPixels({ width: nextWidth, height: nextHeight });
  });

  useLayoutEffect(() => {
    surfaces.current.set(id, { anchor, width, height });
    invalidate();
    return () => { surfaces.current.delete(id); };
  }, [id, width, height, surfaces, invalidate]);

  return <group ref={anchor} position={position} rotation={rotation}>
    {visible && <Html center zIndexRange={[12, 10]} calculatePosition={(object, camera, size) => {
      point.setFromMatrixPosition(object.matrixWorld).project(camera);
      return [Math.round((point.x + 1) * size.width / 2), Math.round((1 - point.y) * size.height / 2)];
    }}>
      <section ref={focusContent} tabIndex={-1} aria-label={label || `${id} on the ${tone === 'screen' || tone === 'phone' ? 'screen' : 'page'}`}
        className={`object-surface surface-${tone} ${mobile ? 'surface-compact' : ''}`}
        style={{ width: pixels.width, height: pixels.height }}
        onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} onWheel={(event) => event.stopPropagation()}>
        <WorldContext.Provider value={world}>{children}</WorldContext.Provider>
      </section>
    </Html>}
  </group>;
}
