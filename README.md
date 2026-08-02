# ace-dev

A minimal, deliberately unfinished personal site — currently showing an
under-construction page ahead of a Blender-built 3D scene.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Motion
- Lenis

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Deploying to GitHub Pages

The site is a static Vite build, so GitHub Pages works out of the box. When
hosting from a project subpath (`username.github.io/repo`), set a relative base
in `vite.config.ts`:

```ts
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
```

Then publish the `dist` output — either commit it to a `gh-pages` branch or use
a workflow such as `peaceiris/actions-gh-pages`.
