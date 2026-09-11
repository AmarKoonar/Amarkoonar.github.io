"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from 'lucide-react';
import { COLUMNS, ROWS, createGame, stepGame, turnGame } from '@/lib/snake.mjs';

const keyDirections = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
const controls = [{ direction: 'left', Icon: ArrowLeft }, { direction: 'up', Icon: ArrowUp }, { direction: 'down', Icon: ArrowDown }, { direction: 'right', Icon: ArrowRight }];

export default function SnakeGame() {
  const [game, setGame] = useState(() => createGame());
  const [best, setBest] = useState(0);
  const swipe = useRef(null);
  const gameRef = useRef(game);
  gameRef.current = game;
  const start = useCallback(() => setGame(createGame('running')), []);
  const turn = useCallback((direction) => setGame((current) => turnGame(current, direction)), []);
  const pause = useCallback(() => setGame((current) => ({ ...current, status: current.status === 'running' ? 'paused' : current.status === 'paused' ? 'running' : current.status })), []);

  useEffect(() => {
    try { setBest(Number(localStorage.getItem('amar-snake-best')) || 0); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => {
    if (game.score <= best) return;
    setBest(game.score);
    try { localStorage.setItem('amar-snake-best', String(game.score)); } catch { /* Keep playing without storage. */ }
  }, [game.score, best]);
  useEffect(() => {
    if (game.status !== 'running') return;
    const timer = setInterval(() => setGame((current) => stepGame(current)), Math.max(85, 170 - game.score * 0.35));
    return () => clearInterval(timer);
  }, [game.status, game.score]);
  useEffect(() => {
    const onKey = (event) => {
      const direction = keyDirections[event.key] || keyDirections[event.key.toLowerCase()];
      if (direction) { event.preventDefault(); turn(direction); }
      else if (event.code === 'Space' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
        event.preventDefault();
        if (['ready', 'over', 'won'].includes(gameRef.current.status)) start(); else if (!event.repeat) pause();
      }
    };
    const stop = () => setGame((current) => current.status === 'running' ? { ...current, status: 'paused' } : current);
    const visibility = () => { if (document.hidden) stop(); };
    window.addEventListener('keydown', onKey); window.addEventListener('blur', stop); document.addEventListener('visibilitychange', visibility);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', visibility); };
  }, [pause, start, turn]);

  const playing = game.status === 'running';
  return <div className="snake-game">
    <header className="snake-header"><div><span className="arcade-label">AFTER HOURS / 01</span><h2>Snake<span>_</span></h2></div><div className="snake-scores"><span>SCORE<strong>{String(game.score).padStart(3, '0')}</strong></span><span>BEST<strong>{String(best).padStart(3, '0')}</strong></span></div></header>
    <div className="snake-play-area">
      <div className="snake-board" onPointerDown={(event) => { if (event.target.closest('button')) return; swipe.current = [event.clientX, event.clientY]; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={(event) => {
        if (!swipe.current) return;
        const [x, y] = swipe.current; swipe.current = null;
        const dx = event.clientX - x, dy = event.clientY - y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
        turn(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
      }} onPointerCancel={() => { swipe.current = null; }}>
        <svg viewBox={`0 0 ${COLUMNS * 10} ${ROWS * 10}`} role="img" aria-label={`Snake board. Score ${game.score}. ${game.status}.`}>
          <defs><pattern id="snake-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 H 0 V 10" fill="none" stroke="#315749" strokeWidth="0.25" /></pattern></defs>
          <rect width="280" height="180" fill="#101f1a" /><rect width="280" height="180" fill="url(#snake-grid)" />
          {game.food && <g transform={`translate(${game.food.x * 10 + 5} ${game.food.y * 10 + 5})`}><rect x="-3.3" y="-3.3" width="6.6" height="6.6" rx="1.4" fill="#edb474" /><rect x="-1.2" y="-1.2" width="2.4" height="2.4" rx=".5" fill="#ffe4b8" /></g>}
          {game.snake.map((cell, index) => <rect key={`${cell.x}-${cell.y}`} x={cell.x * 10 + 0.6} y={cell.y * 10 + 0.6} width="8.8" height="8.8" rx={index === 0 ? 2.5 : 1.3} fill={index === 0 ? '#dcf9ad' : '#9bc77b'} opacity={Math.max(0.45, 1 - index * 0.018)} />)}
        </svg>
        {!playing && <div className="snake-overlay"><span className="arcade-label">{game.status === 'ready' ? 'A LITTLE BREAK FROM THE CODE' : game.status === 'paused' ? 'TAKE YOUR TIME' : 'ONE MORE ROUND?'}</span><h3>{game.status === 'ready' ? 'Stay curious. Stay alive.' : game.status === 'paused' ? 'Paused.' : game.status === 'won' ? 'You filled the board.' : 'End of the line.'}</h3><p>{game.status === 'ready' ? 'Collect the amber squares. Mind the walls.' : game.status === 'paused' ? 'Your next move can wait.' : `You scored ${game.score} points.`}</p><button onClick={game.status === 'paused' ? pause : start}><Play size={15} />{game.status === 'paused' ? 'Resume' : game.status === 'ready' ? 'Play Snake' : 'Play again'}</button></div>}
      </div>
    </div>
    <footer className="snake-footer"><span>ARROWS / WASD <b>·</b> SPACE TO PAUSE</span><div className="snake-controls">{controls.map(({ direction, Icon }) => <button key={direction} onClick={() => turn(direction)} aria-label={`Move ${direction}`}><Icon size={17} /></button>)}</div><div className="snake-actions"><button onClick={pause} disabled={!['running', 'paused'].includes(game.status)} aria-label={playing ? 'Pause game' : 'Resume game'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><button onClick={start} aria-label="Restart game"><RotateCcw size={17} /></button></div></footer>
    <span className="sr-only" role="status">{game.status === 'over' ? `Game over. Score ${game.score}.` : game.status === 'paused' ? 'Game paused.' : game.status === 'won' ? `You won. Score ${game.score}.` : ''}</span>
  </div>;
}
