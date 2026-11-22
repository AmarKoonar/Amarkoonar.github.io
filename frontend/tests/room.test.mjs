import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYER, movePlayer } from '../src/lib/player.mjs';
import { ROOM, roomCollisionBoxes } from '../src/lib/room.mjs';

const standing = (x, z) => ({ x, z, feet: PLAYER.floor, velocityY: 0, grounded: true });
test('free roam cannot walk through the studio back wall or cabinet', () => {
  let player = standing(0, ROOM.back + 0.5);
  for (let i = 0; i < 120; i++) player = movePlayer(player, { x: 0, z: -0.06 }, roomCollisionBoxes, 1 / 60);
  assert.ok(player.z >= ROOM.back + 0.12 + PLAYER.radius);
  player = standing(4.7, -3);
  for (let i = 0; i < 120; i++) player = movePlayer(player, { x: 0, z: -0.06 }, roomCollisionBoxes, 1 / 60);
  assert.ok(player.z >= -4.45 + 1.45 / 2 + PLAYER.radius);
});
test('the path in front of the workstation remains open', () => {
  let player = standing(8, 5);
  for (let i = 0; i < 80; i++) player = movePlayer(player, { x: -0.1, z: 0 }, roomCollisionBoxes, 1 / 60);
  assert.ok(Math.abs(player.x) < 0.001);
  assert.equal(player.feet, PLAYER.floor);
});
