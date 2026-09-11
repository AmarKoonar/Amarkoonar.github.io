"use client";
import { RoundedBox } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

export function Box({ size = [1, 1, 1], color = '#333732', radius = 0.04, metalness = 0, roughness = 0.55, ...props }) {
  const safeRadius = Math.min(radius, ...size.map((edge) => edge * 0.49));
  return <RoundedBox args={size} radius={safeRadius} smoothness={2} castShadow receiveShadow {...props}><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></RoundedBox>;
}
export function BlankSurface({ size, color = '#172729', ...props }) {
  return <mesh {...props}><planeGeometry args={size} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>;
}
export function Cylinder({ args = [0.1, 0.1, 1, 20], color = '#333732', ...props }) {
  return <mesh castShadow receiveShadow {...props}><cylinderGeometry args={args} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>;
}
// Small, local canvas textures avoid remote fonts, models, and texture downloads.
export function Label({ text, subtitle = '', color = '#ece4d3', background = '#1c2729', size = [1, 0.55], ...props }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background; ctx.fillRect(0, 0, 768, 384);
    ctx.fillStyle = color; ctx.font = 'bold 64px monospace'; ctx.fillText(text, 46, 145);
    ctx.globalAlpha = 0.68; ctx.font = '24px monospace'; ctx.fillText(subtitle, 48, 204);
    ctx.globalAlpha = 0.3; ctx.fillRect(48, 263, 380, 3); ctx.fillRect(48, 284, 270, 3);
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; return result;
  }, [text, subtitle, color, background]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh {...props}><planeGeometry args={size} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>;
}
