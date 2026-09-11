"use client";
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Quaternion, Matrix4, MathUtils } from 'three';
import { chapters } from '@/data/workspace';
import { useWorld } from '../workspace/WorldContext';

export default function CameraController({ progress, focus, surfaces, onFocusReady, reducedMotion, mobile }) {
  const world = useWorld();
  const { invalidate, size: viewport } = useThree();
  const delivered = useRef(null);
  useEffect(() => {
    delivered.current = null;
    onFocusReady(null);
    invalidate();
  }, [focus, mobile, viewport.width, viewport.height, onFocusReady, invalidate]);
  const v = useMemo(() => ({ position: new Vector3(), target: new Vector3(), next: new Vector3(), normal: new Vector3(), up: new Vector3(0, 1, 0), quaternion: new Quaternion(), matrix: new Matrix4() }), []);
  useFrame(({ camera, size }, delta) => {
    if (world.mode === 'roam' && !focus) return;
    const surface = focus && surfaces.current.get(focus);
    if (surface?.anchor.current) {
      surface.anchor.current.updateWorldMatrix(true, false);
      surface.anchor.current.getWorldPosition(v.target);
      surface.anchor.current.getWorldQuaternion(v.quaternion);
      v.normal.set(0, 0, 1).applyQuaternion(v.quaternion);
      const tangent = Math.tan(camera.fov * Math.PI / 360);
      // Leave space for the exit control and section dock on short screens.
      const heightFraction = Math.max(0.35, Math.min(0.78, (size.height - (mobile ? 205 : 195)) / size.height));
      const widthFraction = mobile ? focus === 'about' ? 0.70 : 0.92 : 0.87;
      const distance = Math.max(surface.height / (2 * tangent * heightFraction), surface.width / (2 * tangent * camera.aspect * widthFraction));
      v.position.copy(v.target).addScaledVector(v.normal, distance);
      if (mobile && focus === 'about') v.position.add(v.next.set(.1,0,0).applyQuaternion(v.quaternion));
    } else {
      delivered.current = null;
      const p = MathUtils.clamp(progress.current, 0, chapters.length - 1);
      const a = chapters[Math.floor(p)], b = chapters[Math.min(Math.floor(p) + 1, chapters.length - 1)];
      const t = MathUtils.smoothstep(p % 1, 0, 1);
      v.position.fromArray(a.position).lerp(v.next.fromArray(b.position), t);
      v.target.fromArray(a.target).lerp(v.next.fromArray(b.target), t);
      if (mobile) { v.target.x += 1.1; v.position.copy(v.target).add(v.next.set(4, 7.5, 10)); }
      v.matrix.lookAt(v.position, v.target, v.up); v.quaternion.setFromRotationMatrix(v.matrix);
    }
    const distance = camera.position.distanceTo(v.position);
    const angle = camera.quaternion.angleTo(v.quaternion);
    const ease = reducedMotion ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.05));
    camera.position.lerp(v.position, ease); camera.quaternion.slerp(v.quaternion, ease);
    if (surface && distance < 0.008 && angle < 0.004) {
      // Snap the last fraction of a pixel before showing unscaled HTML text.
      camera.position.copy(v.position); camera.quaternion.copy(v.quaternion);
      if (delivered.current !== focus) { delivered.current = focus; onFocusReady(focus); }
    }
    if (distance > 0.0005 || angle > 0.0005) invalidate();
  });
  return null;
}
