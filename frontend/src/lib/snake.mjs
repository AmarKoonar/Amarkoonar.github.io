export const COLUMNS = 28;
export const ROWS = 18;
export const DIRECTIONS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sameCell = (a, b) => a.x === b.x && a.y === b.y;

export function createGame(status = 'ready') {
  return { snake: [{ x: 7, y: 9 }, { x: 6, y: 9 }, { x: 5, y: 9 }], direction: 'right', queued: null, food: { x: 14, y: 9 }, score: 0, status };
}

export function placeFood(snake, random = Math.random) {
  const occupied = new Set(snake.map(({ x, y }) => `${x},${y}`));
  const free = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLUMNS; x++) if (!occupied.has(`${x},${y}`)) free.push({ x, y });
  return free.length ? free[Math.min(free.length - 1, Math.floor(random() * free.length))] : null;
}

export function turnGame(game, direction) {
  if (game.status !== 'running' || game.queued || !DIRECTIONS[direction]) return game;
  const current = DIRECTIONS[game.direction], next = DIRECTIONS[direction];
  if (next[0] === -current[0] && next[1] === -current[1]) return game;
  return direction === game.direction ? game : { ...game, queued: direction };
}

export function stepGame(game, random = Math.random) {
  if (game.status !== 'running') return game;
  const direction = game.queued || game.direction;
  const [dx, dy] = DIRECTIONS[direction];
  const head = { x: game.snake[0].x + dx, y: game.snake[0].y + dy };
  const eats = game.food && sameCell(head, game.food);
  // Moving into the cell the tail vacates is legal when not growing.
  const body = eats ? game.snake : game.snake.slice(0, -1);
  if (head.x < 0 || head.x >= COLUMNS || head.y < 0 || head.y >= ROWS || body.some((cell) => sameCell(cell, head))) return { ...game, status: 'over', queued: null };
  const snake = [head, ...game.snake];
  if (!eats) snake.pop();
  const food = eats ? placeFood(snake, random) : game.food;
  return { ...game, snake, direction, queued: null, food, score: game.score + (eats ? 10 : 0), status: food ? 'running' : 'won' };
}
