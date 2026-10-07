# Conventions

## Code Style
- Use ES Modules (`import`/`export`).
- Prefer functional React components.
- Use Tailwind classes directly inline.

## Assets & Images
- Store static assets in the public directory (e.g., `/assets/`).
- Reference them via absolute paths in components (e.g., `<img src="/assets/logo.png" />`).

## Environment Variables
- Handled by Vite, prefixed with `VITE_` (e.g., `VITE_CESIUM_TOKEN` in `.env`).
- Accessed via `import.meta.env`.

## Linting
- Strictly enforced by ESLint. Always run `npm run lint` after creating or modifying files.
