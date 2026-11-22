// Shared by the rendered room, walking collisions, and throwable desk objects.
export const ROOM = { floor: -2.67, ceiling: 10.5, left: -11.5, right: 11.5, back: -5.5, front: 12 };
export const roomSolids = [
  { position: [0, 3.915, ROOM.back], size: [23, 13.17, 0.24] },
  { position: [ROOM.left, 3.915, 3.25], size: [0.24, 13.17, 17.5] },
  { position: [ROOM.right, 3.915, 3.25], size: [0.24, 13.17, 17.5] },
  { position: [0, 3.915, ROOM.front], size: [23, 13.17, 0.24] },
  { position: [0, ROOM.ceiling, 3.25], size: [23, 0.24, 17.5] },
  { position: [4.7, -1.4, -4.45], size: [4, 2.5, 1.45] },
  { position: [-8.8, -1.85, -3.6], size: [1.2, 1.6, 1.2] },
];
export const roomCollisionBoxes = roomSolids.map(({ position, size }) => ({
  min: { x: position[0] - size[0] / 2, y: position[1] - size[1] / 2, z: position[2] - size[2] / 2 },
  max: { x: position[0] + size[0] / 2, y: position[1] + size[1] / 2, z: position[2] + size[2] / 2 },
}));
