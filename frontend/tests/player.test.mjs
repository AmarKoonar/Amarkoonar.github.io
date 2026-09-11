import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYER,movePlayer } from '../src/lib/player.mjs';
const standing=()=>({x:0,z:4,feet:PLAYER.floor,velocityY:0,grounded:true});
test('jump rises, gravity returns to floor, and airborne jumps cannot stack',()=>{let p=standing();p=movePlayer(p,{x:0,z:0},[],1/60,true);assert.ok(p.feet>PLAYER.floor);const v=p.velocityY;p=movePlayer(p,{x:0,z:0},[],1/60,true);assert.ok(p.velocityY<v);for(let i=0;i<180;i++)p=movePlayer(p,{x:0,z:0},[],1/60);assert.equal(p.feet,PLAYER.floor);assert.equal(p.grounded,true);});
test('solid desk blocks walking and player stays in playable bounds',()=>{const box={min:{x:-5,y:-.1,z:-2.3},max:{x:5,y:.1,z:2.3}};let p={...standing(),z:2.65};p=movePlayer(p,{x:0,z:-.3},[box],1/60);assert.equal(p.z,2.65);p=movePlayer({...standing(),x:10.9},{x:.3,z:0},[],1/60);assert.equal(p.x,10.9);});
test('falling player lands on physical object tops',()=>{const box={min:{x:-1,y:-2.67,z:3},max:{x:1,y:-2.1,z:5}};let p={...standing(),feet:-1,grounded:false};for(let i=0;i<60;i++)p=movePlayer(p,{x:0,z:0},[box],1/60);assert.equal(p.feet,-2.1);assert.equal(p.grounded,true);});
