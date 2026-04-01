# Jefferson House Virtual Tour — Design Spec

## Overview

Interactive 3D virtual tour of Jefferson House built from a SketchUp-exported GLB model. Serves prospective tenants (primary), investors, and general public. Lives as a standalone page embeddable via iframe into the main JH site.

## Architecture

Single HTML file (`tour.html`) in `~/jefferson-house-site/`. No build step, no framework. All dependencies via CDN:

- **Three.js** — 3D rendering, scene, camera, controls
- **GLTFLoader** — loads the GLB model
- **DRACOLoader** — decompresses Draco-encoded geometry
- **Tween.js** — smooth camera position animations

Source model: `CAD - August Pre - Constr s - Jefferson House - 2025 Aug.glb` (81MB), Draco-compressed to a smaller GLB for production use.

### Three Layers

1. **3D Viewport** — full-screen Three.js canvas, black (`#000`) background for maximum model contrast
2. **UI Chrome** — HTML/CSS overlays on top of canvas: top nav bar (navy `#1c273f`), tour stop dot indicators, Tour/Explore mode toggle, prev/next arrows
3. **Info Panel** — slide-in overlay (right side on desktop, bottom sheet on mobile) showing suite details when a stop is active or hotspot is clicked

### Embedding

The page works standalone at `/tour` or `tour.html` and is embeddable via iframe on the main Jefferson House site.

## Brand Identity

### Colors
- **Black** (`#000`) — 3D viewport background
- **Navy** (`#1c273f`) — UI chrome, nav bar, info panel backgrounds
- **Sand** (`#e0d6ca`) — body text
- **Cream** (`#f5f0ea`) — headings, primary text
- **Copper** (`#b87333`) — accents, borders, CTAs, progress bar
- **Sage** (`#6b7f5e`) — secondary accent, status badges, labels

### Typography
- **Playfair Display** — headings
- **DM Sans** — body text, UI labels
- **JetBrains Mono** — data/specs (square footage, etc.)

## Tour Stops

Pre-set camera positions with smooth animated transitions (~1.5s ease-in-out):

| # | Stop | Description |
|---|------|-------------|
| 1 | Exterior Wide | Full building establishing shot from southeast |
| 2 | Entrance / Courtyard | Closer approach showing shared areas |
| 3 | Suite A1 | Restaurant, 640 SF |
| 4 | Suite A2 | Restaurant, 640 SF |
| 5 | Suite A3 | Restaurant, 640 SF |
| 6 | B-Block Retail | B1 through B4 grouped, 160 SF each |
| 7 | Suite R440 | Retail, 440 SF |
| 8 | Suite R192 | Retail, 192 SF |
| 9 | Final Wide | Pull back to full building with Apply Now CTA |

Camera positions and look-at targets will be tuned after loading the model to determine its orientation and scale.

## Navigation Modes

### Tour Mode (default)
- Prev/next arrows to step through stops
- Dot indicators showing current position in sequence
- Auto-advance after idle (configurable, ~8 seconds)
- Info panel auto-displays at each suite stop

### Explore Mode
- Full orbit, pan, zoom via OrbitControls
- Floating hotspot markers over each suite (clickable to open info panel)
- Toggle back to Tour Mode resumes from nearest stop

Mode toggle in top nav bar with copper highlight on active mode.

## Suite Info Panels

Displayed at each suite stop (Tour Mode) or on hotspot click (Explore Mode). Slides in from the right on desktop, bottom sheet on mobile.

### Content per suite:
- **Type and size** — e.g., "Restaurant · 640 SF" (JetBrains Mono)
- **Availability status** — badge: Available (sage), Under Negotiation (copper), Leased (muted sand)
- **Photo gallery** — carousel of renders/reference images for that space (if images exist)

No pricing displayed (keeps the tour as a lead-gen tool). No suite name prominence (type + size is sufficient).

## Loading Experience

### Draco Compression
- Pre-process the 81MB GLB using `gltf-pipeline` with Draco encoding
- Expected output: ~8-15MB compressed GLB
- Compressed file stored in `~/jefferson-house-site/` alongside tour.html

### Loading Screen
- Full-screen navy background
- JH logo (`logo-script.png` with `filter: invert(1)`)
- Copper progress bar showing actual download percentage (XHR progress events)
- "Loading Virtual Tour..." in DM Sans
- Fades out and reveals 3D scene on completion

## Mobile Support

- **Tour Mode**: swipe left/right to navigate between stops
- **Explore Mode**: touch to orbit, two-finger pan, pinch to zoom
- **Info panel**: full-width bottom sheet instead of right-side panel
- Same model quality (Draco handles file size, no LOD needed)

## Browser Support

- All modern browsers with WebGL support (Chrome, Firefox, Safari, Edge)
- Fallback: static hero image with message "Your browser doesn't support 3D tours" if WebGL unavailable
- No IE11 support needed

## File Structure

```
~/jefferson-house-site/
  tour.html                          # The virtual tour (single file)
  jefferson-house-tour.glb           # Draco-compressed model
  img/
    logo-script.png                  # Existing logo
    tour/                            # Suite photos for gallery panels
      a1-*.jpg
      a2-*.jpg
      ...
```

## Out of Scope

- VR/AR headset support
- Real-time availability from platform API (hardcoded status for now)
- Video or audio narration
- Multi-floor navigation (single building)
