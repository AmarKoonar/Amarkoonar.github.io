import test from 'node:test';
import assert from 'node:assert/strict';
import { COLUMNS, ROWS, createGame, placeFood, stepGame, turnGame } from '../src/lib/snake.mjs';

test('eating grows the snake, scores points, and places food off its body', () => {
  const game = createGame('running');
  game.food = { x: 8, y: 9 };
  const next = stepGame(game, () => 0);
  assert.equal(next.score, 10);
  assert.equal(next.snake.length, 4);
  assert.ok(!next.snake.some((cell) => cell.x === next.food.x && cell.y === next.food.y));
});
test('reversing is rejected and only one turn can be buffered per tick', () => {
  const game = createGame('running');
  assert.equal(turnGame(game, 'left'), game);
  const up = turnGame(game, 'up');
  assert.equal(turnGame(up, 'left'), up);
  const next = stepGame(up);
  assert.equal(next.direction, 'up');
  assert.equal(next.queued, null);
  assert.deepEqual(next.snake[0], { x: 7, y: 8 });
});
test('wall and body collisions end the game', () => {
  const game = createGame('running');
  game.snake[0] = { x: COLUMNS - 1, y: 9 };
  assert.equal(stepGame(game).status, 'over');
  game.snake = [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }];
  assert.equal(stepGame(game).status, 'over');
});
test('entering the cell a tail is vacating is legal', () => {
  const game = createGame('running');
  game.snake = [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }];
  assert.equal(stepGame(game).status, 'running');
});
test('paused games do not move; full boards have no food cells', () => {
  const game = createGame('paused');
  assert.equal(stepGame(game), game);
  const full = Array.from({ length: COLUMNS * ROWS }, (_, index) => ({ x: index % COLUMNS, y: Math.floor(index / COLUMNS) }));
  assert.equal(placeFood(full), null);
});
