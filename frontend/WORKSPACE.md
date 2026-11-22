# Interactive portfolio

This progressively enhances the existing Next.js App Router portfolio. JavaScript remains the project language; the original section components and assets are retained. Static export and the existing GitHub Pages workflow are preserved.

## Structure

- `src/data/portfolio.js`: the four original projects, six courses, and contact links.
- `src/data/workspace.js`: biography, skills, chapter ordering, and camera positions.
- `src/components/3d/Scene.jsx`: lazy client-only WebGL canvas, lighting, surface registry, and lifecycle.
- `src/components/3d/CameraController.jsx`: scroll timeline and a surface-aligned focus camera. The focus pose is derived from the selected surface’s world position and quaternion, with framing calculated from its dimensions and the viewport.
- `src/components/3d/InteractiveObject.jsx`: reusable raycast interaction, lift, cursor, and labels.
- `src/components/3d/Desktop.jsx`: workstation composition, instanced keyboard, accessories, cables, study stack, and raised laptop stand.
- `src/components/3d/Room.jsx`: enclosed studio with a window opening, curtains, wood flooring, woven rug, cabinet, wall art, and a floor plant. `src/lib/room.mjs` shares static collision bounds between free roam and desk-object physics.
- `src/components/3d/{Laptop,Monitor,Notebook,Phone}.jsx`: individual navigable objects.
- `src/components/workspace/Workspace.jsx`: navigation, scroll state, focused-object state, reading view, and failure recovery.
- `src/components/workspace/PortfolioContent.jsx`: shared semantic HTML and original content links.

## Add an object

Add a chapter with its camera position and target to `workspace.js`, create a model wrapped in `InteractiveObject`, and place it in `Desktop`. Place a `Surface` inside the model at the actual display/page plane and give it the same object ID, physical size, and content. Add a reading-view section to `PortfolioContent` and navigation icon to `Workspace`. Update the scroll chapter count if adding a new chapter. Decorative objects need no chapter.

## Interaction and accessibility

Scrolling moves through six chapters. Clicking a desk object or dock button moves to its chapter and aligns the camera with the selected object’s surface. The monitor displays all four projects, including selectable detail views. The raised laptop runs Snake, also accessible from the dock with a keyboard. The résumé is a single sheet displaying the original PDF. Escape returns to the desk and restores focus. The chapter rail moves between scenes without opening a panel. Reading view provides all content without spatial interaction. Legacy section hashes are recognized. The initial HTML includes the whole portfolio, including without JavaScript.

Reduced-motion visitors start in reading view and can opt into stationary transitions in 3D. Small screens use different camera framing, touch controls, and viewport-aware surface framing. WebGL2 failure, context loss, or loading timeout exposes reading view automatically.

## Rendering budget

The scene uses local procedural geometry and small generated textures, with no remote model or font requests from the 3D layer. Keyboard keys share an instanced draw call. Desktop pixel ratio is capped at 1.5; mobile uses 1. Desktop uses a 2048px key-light shadow map with contact-hardening soft shadows and a 512px lamp shadow map. Mobile keeps one filtered 512px key-light shadow map and a 64px reflection environment, disables lamp shadows and soft-shadow sampling, and reduces accessories. The renderer uses demand rendering and stops requesting frames after transitions settle. Texture resources and event listeners are disposed on unmount. No postprocessing render passes are used.

Lighting combines a warm window key, cool fill, restrained hemisphere bounce, and a locally generated reflection environment. ACES tone mapping preserves highlights. The lamp's spotlight and target live inside its physical group so the light follows creative-mode movement. `SurfaceMaterials.js` generates deterministic wood, fabric, and stone bump/roughness maps; only color textures use sRGB. The desk has rounded edges and a subtle clear coat, while ceramic and metal use distinct roughness values.

The studio surrounds all cinematic camera positions and has a real opening in the back wall for window light. Its walls and furnishings receive shadows; the window frame casts daylight patterns into the room. Static walls, ceiling, cabinet, and planter participate in walking and throwable-object collisions.

## Studio atmosphere and controls

`src/data/atmospheres.js` defines Daylight, Golden hour, and After hours. The mood control changes the key light, fill, reflected environment, window landscape, and cabinet accent lighting together. Golden hour is the initial mood; a visitor's selection is saved locally when storage is available. Mood changes regenerate the small environment map once, without adding a continuous animation loop.

`WindowView.jsx` draws the mountain scenery locally, including a sunset or moon and stars. `ScreenPreview.js` generates static monitor, terminal, and contact previews; the actual focused content remains accessible, pixel-aligned HTML. The monitor preview uses the existing project data.

`StudioControls.jsx` provides lighting selection, opt-in playback of the existing music track, and a collapsible room-control panel. Object labels are hidden until hovered, active, or enabled in Room controls. Walking, camera reset, and world reset are available in the same panel. The responsive visual treatment is in `studio.css`; mobile gives the introduction its own space above the desk. Reduced-motion, reading view, and WebGL fallback behavior remain available.

## Development

Run `npm run dev` for a preview and `npm run build` for the production static export in `out/`. Development output uses `.next-dev` so preview compilation does not conflict with production builds in `.next`. The existing Next.js Google font configuration requires network access on an uncached build.

## Verification checklist

- Build and static export succeed; portfolio copy and all local asset targets are present.
- In a browser, check scroll forward/backward, every object, dock, chapter rail, Escape, keyboard focus, original hashes, project links, on-paper PDF enlargement/download, and reading-mode switching.
- Check 390px touch layout, short landscape screens, reduced motion, JavaScript disabled, and WebGL context loss.
- Measure frame timing and memory on target devices; build success alone does not establish a frame-rate guarantee.

## Focused text sharpness

`Surface.jsx` registers the physical screen/page anchor with `CameraController`. The camera approaches along its normal and adopts its orientation, making the content plane parallel to the viewport. Once settled, Drei Html projects pixel-aligned, unscaled browser text into the exact surface rectangle. No CSS 3D scale, canvas texture, or WebGL pixel-ratio cap is applied to readable text. The original PDF is rendered as `public/resume/page-1.png` at 2473 × 3200 pixels, with an enlargement control and the original PDF links. Regenerate that image when replacing the PDF. Focused content scrolls independently of the camera timeline.

## Laptop game

The laptop opens the terminal. Run `./snake.exe` to play Snake, or `./oldsite.exe` to open the original portfolio at `/classic/`. The classic route reuses the original sections and provides a fixed return link to `/`; the 3D workspace remains the main site. Static export uses trailing slashes so the classic route has its own `index.html`.

Hover effects are local to each interactive object: screen illumination, a small laptop lid movement, a book shuffle, a notebook cover peek, and a resume paper tilt. They settle before focused content opens, are suppressed during physics modes, and respect reduced-motion preferences. Shared hover helpers live in `src/components/3d/HoverDetails.jsx`.

`SnakeGame.jsx` renders a sharp SVG board with keyboard arrows/WASD, touch swipes, direction buttons, pause/resume, and restart. Space starts or pauses play. The game pauses when the tab is hidden or the browser loses focus; its timer is disposed when exiting the laptop. High scores are stored locally when storage is available. Core logic lives in `src/lib/snake.mjs`; run `node --test tests/snake.test.mjs` for movement, collision, growth, food placement, and input-buffer checks.
