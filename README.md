# JSPARK AI - Official Website

This repository contains the frontend marketing website for JSPARK AI, built with React, Vite, Tailwind CSS v4, and extensive 3D/animation libraries.

## Prerequisites

- Node.js (v18+)
- `pnpm` (Package manager)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example` (if present) or request the required keys from the engineering team.
   
   Required variables:
   ```env
   VITE_CESIUM_TOKEN=your_cesium_ion_token_here
   ```
   *Note: Ensure the Cesium token is domain-restricted in the Cesium dashboard since it is exposed to the client.*

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

4. **Linting and Formatting:**
   ```bash
   pnpm run lint
   # Or to automatically fix issues:
   pnpm run lint:fix
   ```

5. **Build for Production:**
   ```bash
   pnpm run build
   ```

## Architecture Overview

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP, Lenis (smooth scrolling)
- **3D**: Three.js, React Three Fiber, Cesium

For detailed agent workflows and codebase conventions, please refer to the `.antigravity/AGENTS.md` and `docs/` directories.
