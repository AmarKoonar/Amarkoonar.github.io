"use client";
import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { atmospheres } from '@/data/atmospheres';

export default function WindowView({ atmosphere }) {
  const texture = useMemo(() => {
    const palette = atmospheres[atmosphere];
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 768;
    const ctx = canvas.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, 768);
    palette.sky.forEach((color, i) => sky.addColorStop(i, color));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 768, 768);
    const night = atmosphere === 'night';
    if (night) {
      for (let i = 0; i < 60; i++) {
        ctx.globalAlpha = 0.25 + (i % 5) * 0.12;
        ctx.fillStyle = '#eceddc'; ctx.fillRect((i * 137.5) % 768, (i * 73.3) % 350, i % 3 ? 1 : 2, 2);
      }
      ctx.globalAlpha = 1;
    }
    const glow = ctx.createRadialGradient(560, 190, 0, 560, 190, night ? 70 : 155);
    glow.addColorStop(0, night ? '#dae2cf66' : '#fff0c990'); glow.addColorStop(1, '#fff0c900');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 768, 768);
    ctx.fillStyle = night ? '#e0e6d5' : '#fff0cf';
    ctx.beginPath(); ctx.arc(560, 190, night ? 22 : 35, 0, Math.PI * 2); ctx.fill();
    palette.mountains.forEach((color, layer) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, 768);
      for (let x = 0; x <= 768; x += 8) {
        const y = 370 + layer * 110 + Math.sin(x * 0.009 + layer * 2) * 66 + Math.sin(x * 0.025 + layer) * 24 + Math.cos(x * 0.057) * 9;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(768, 768); ctx.closePath(); ctx.fill();
    });
    // A quiet treeline gives the distant mountains a foreground scale.
    ctx.fillStyle = night ? '#14282c' : '#324c42';
    for (let i = 0; i < 38; i++) {
      const x = i * 23, y = 672 + Math.sin(i * 0.8) * 30, height = 28 + i % 5 * 11;
      ctx.beginPath(); ctx.moveTo(x, y - height); ctx.lineTo(x - 14, y); ctx.lineTo(x + 14, y); ctx.fill();
    }
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace;
    return result;
  }, [atmosphere]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, 0, -0.15]}><planeGeometry args={[5.6, 5.4]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>;
}
