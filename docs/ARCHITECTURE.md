# Architecture

## Technical Stack
- **Framework**: React 18 (Vite build system)
- **Routing**: `react-router-dom`
- **Styling**: Tailwind CSS v4 (No config file, configured via CSS variables/directives)
- **Animations**: `framer-motion` for React component animations, `gsap` for complex sequencing, `lenis` for smooth scrolling.
- **3D Graphics**: `three`, `@react-three/fiber`, `cesium`.

## Directory Structure
- `src/pages/`: Route entry points (`Home`, `Products`, `Apply`, etc.).
- `src/features/`: Domain-specific logic and components (e.g., `marketing`).
  - `src/features/*/components/`: Feature-specific UI.
  - `src/features/*/data/`: Hardcoded copy and configuration.
- `src/shared/`: Globally reusable code.
  - `src/shared/ui/`: Dumb, reusable components (Navbar, Footer, LoadGate).
  - `src/shared/design/`: Global CSS tokens and Tailwind entry (`base.css`, `tailwind.css`).
  - `src/shared/animations/`: Reusable animation logic.
