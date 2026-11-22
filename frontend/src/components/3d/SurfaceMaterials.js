"use client";
import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

// Deterministic, seamless surface maps: no image downloads or random render changes.
export function useSurfaceMaps(kind) {
  const maps = useMemo(() => {
    const size = 256;
    const colorCanvas = document.createElement('canvas');
    const heightCanvas = document.createElement('canvas');
    const roughCanvas = document.createElement('canvas');
    const canvases = [colorCanvas, heightCanvas, roughCanvas];
    const contexts = canvases.map(canvas => {
      canvas.width = canvas.height = size;
      return canvas.getContext('2d');
    });
    const pixels = contexts.map(ctx => ctx.createImageData(size, size));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size * Math.PI * 2, v = y / size * Math.PI * 2;
        const seed = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
        const noise = seed - Math.floor(seed);
        const grain = Math.sin(v * 36 + Math.sin(u) * 2 + Math.sin(u * 3) * 0.65);
        const pores = Math.pow((grain + 1) / 2, 12);
        const weave = (Math.cos(u * 64) + Math.cos(v * 64)) * 0.5;
        const wood = kind === 'wood';
        const fabric = kind === 'fabric';
        const variation = wood ? grain * 5 - pores * 13 + noise * 3 : noise * 4;
        const base = wood ? [116, 79, 48] : [255, 255, 255];
        const height = wood ? 150 - pores * 70 + noise * 12 : fabric ? 125 + weave * 50 + noise * 20 : 110 + noise * 65;
        const roughness = wood ? 155 + pores * 50 + noise * 12 : fabric ? 220 + noise * 25 : 195 + noise * 30;
        const offset = (y * size + x) * 4;
        for (let channel = 0; channel < 3; channel++) {
          pixels[0].data[offset + channel] = base[channel] + variation;
          pixels[1].data[offset + channel] = height;
          pixels[2].data[offset + channel] = roughness;
        }
        for (const data of pixels) data.data[offset + 3] = 255;
      }
    }
    const textures = canvases.map((canvas, i) => {
      contexts[i].putImageData(pixels[i], 0, 0);
      const texture = new CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = RepeatWrapping;
      const repeat = kind === 'wood' ? [2, 1] : kind === 'fabric' ? [6, 4] : [120, 120];
      texture.repeat.set(...repeat);
      texture.anisotropy = 4;
      if (i === 0) texture.colorSpace = SRGBColorSpace;
      return texture;
    });
    return { map: textures[0], bumpMap: textures[1], roughnessMap: textures[2] };
  }, [kind]);
  useEffect(() => () => Object.values(maps).forEach(texture => texture.dispose()), [maps]);
  return maps;
}
