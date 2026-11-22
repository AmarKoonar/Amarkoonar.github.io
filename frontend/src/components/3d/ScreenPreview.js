"use client";
import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { projects } from '@/data/portfolio';

export function useScreenPreview(kind, portrait) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = portrait ? 512 : 1024; canvas.height = portrait ? 960 : 600;
    const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
    const background = ctx.createLinearGradient(0, 0, w, h);
    background.addColorStop(0, '#203e38'); background.addColorStop(1, '#101e23');
    ctx.fillStyle = background; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#ffffff18'; ctx.beginPath(); ctx.moveTo(30, 64); ctx.lineTo(w - 30, 64); ctx.stroke();
    ['#ce9a79', '#dbc292', '#9cae8d'].forEach((color, i) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(38 + i * 22, 34, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.font = '17px monospace'; ctx.fillStyle = '#b5c3b7';
    ctx.textAlign = 'right'; ctx.fillText(kind === 'terminal' ? 'amar@workspace: ~' : 'AMAR / STUDIO', w - 30, 40); ctx.textAlign = 'left';
    if (kind === 'projects') {
      ctx.fillStyle = '#eee8d7'; ctx.font = `500 ${portrait ? 38 : 48}px sans-serif`; ctx.fillText('Selected work.', 38, 136);
      ctx.fillStyle = '#9eafa7'; ctx.font = '18px monospace'; ctx.fillText('A few things I’ve built', 40, 171);
      projects.forEach((project, i) => {
        const columns = portrait ? 1 : 2, cw = (w - 100) / columns;
        const x = 38 + (i % columns) * (cw + 22), y = 205 + Math.floor(i / columns) * (portrait ? 166 : 160);
        ctx.fillStyle = ['#3a5147', '#575b46', '#384b55', '#4b4649'][i]; ctx.fillRect(x, y, cw, 137);
        ctx.fillStyle = '#e2c799'; ctx.font = '15px monospace'; ctx.fillText(`0${i + 1} / ${project.tags[0].toUpperCase()}`, x + 20, y + 30);
        ctx.fillStyle = '#f1eddf'; ctx.font = '26px sans-serif'; ctx.fillText(project.title, x + 20, y + 76, cw - 40);
        ctx.fillStyle = '#a9b8ac'; ctx.font = '15px monospace'; ctx.fillText('OPEN PROJECT  ↗', x + 20, y + 113);
      });
    } else if (kind === 'terminal') {
      const lines = [
        ['#b9c9b4', 'Welcome to the workspace.'],
        ['#739080', '────────────────────────────────────────'],
        ['#e6c797', 'amar@studio:~$ whoami'],
        ['#d6dfd3', 'Developer. Builder. Always curious.'],
        ['#e6c797', 'amar@studio:~$ ls'],
        ['#a5bcdf', 'projects/   about/   resume/'],
        ['#b1c98c', 'snake.exe   music.exe   creative.exe'],
        ['#e6c797', 'amar@studio:~$ _'],
      ];
      lines.forEach(([color, text], i) => { ctx.fillStyle = color; ctx.font = '24px monospace'; ctx.fillText(text, 42, 124 + i * 51); });
    } else {
      ctx.fillStyle = '#e9ddbf'; ctx.font = '30px monospace'; ctx.fillText('HELLO THERE', 45, 180);
      ctx.fillStyle = '#f4efdf'; ctx.font = '64px sans-serif'; ctx.fillText('Let’s', 42, 300); ctx.fillText('connect.', 42, 375);
      ctx.fillStyle = '#9db8a8'; ctx.font = '23px sans-serif'; ctx.fillText('Ideas start with a conversation.', 45, 440, w - 90);
      ctx.fillStyle = '#d8c29b'; ctx.beginPath(); ctx.arc(w / 2, 650, 48, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#20362d'; ctx.font = '42px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('↗', w / 2, 665);
      ctx.fillStyle = '#9db8a8'; ctx.font = '18px monospace'; ctx.fillText('TAP TO OPEN', w / 2, 755);
    }
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; result.anisotropy = 4;
    return result;
  }, [kind, portrait]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
