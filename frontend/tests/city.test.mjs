import test from 'node:test';
import assert from 'node:assert/strict';
import {blocked,buildings,stepPlayer} from '../src/lib/city.mjs';
import {createShell,execute,complete} from '../src/lib/terminal.mjs';
const player=()=>({x:0,z:0,y:0,vx:0,vz:0,vy:0});
test('city has traversable streets and solid buildings',()=>{
  assert.equal(buildings.length,49);
  for(let z=-100;z<=100;z++)assert.equal(blocked(0,z),false);
  for(const b of buildings)assert.equal(blocked(b.x,b.z),true);
  assert.equal(blocked(109,0),true);
  const b=buildings[24],p=player();p.x=b.x-b.w/2-1;p.z=b.z;
  for(let i=0;i<200;i++)stepPlayer(p,{x:1,z:0,sprint:true},1/60);
  assert.ok(p.x<=b.x-b.w/2-.38);
});
test('sprint is faster, diagonal speed is normalized, and release decelerates',()=>{
  const walk=player(),run=player(),diagonal=player();
  for(let i=0;i<60;i++){stepPlayer(walk,{x:0,z:-1},1/60);stepPlayer(run,{x:0,z:-1,sprint:true},1/60);stepPlayer(diagonal,{x:-1,z:-1},1/60);}
  assert.ok(Math.abs(run.z)>Math.abs(walk.z)*1.9);
  assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-Math.abs(walk.z))<.001);
  for(let i=0;i<60;i++)stepPlayer(run,{x:0,z:0},1/60);
  assert.ok(Math.abs(run.vz)<.001);
});
test('jump has gravity, disallows airborne jump, and lands on floor',()=>{
  const p=player();stepPlayer(p,{x:0,z:0,jump:true},1/60);assert.ok(p.y>0);
  const vy=p.vy;stepPlayer(p,{x:0,z:0,jump:true},1/60);assert.ok(p.vy<vy);
  for(let i=0;i<120;i++)stepPlayer(p,{x:0,z:0},1/60);
  assert.equal(p.y,0);assert.equal(p.vy,0);
});
test('reality executable is discoverable and emits the correct action',()=>{
  const shell=createShell();assert.match(execute(shell,'help').text,/reality.exe/);
  assert.equal(execute(shell,'./reality.exe').action,'reality');
  assert.equal(complete(shell,'./rea').line,'./reality.exe ');
});
