# Quick Start

## Install Dependencies

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

This will create:
- `dist/index.js` and `dist/index.cjs` - main module with component
- `dist/vite-plugin.js` and `dist/vite-plugin.cjs` - Vite plugin
- `dist/*.d.ts` - TypeScript type definitions

## Local Testing

To test the module locally in another project:

```bash
# In vue-picture-compressor directory
npm link

# In your project
npm link vue-picture-compressor
```

## Project Structure

```
vue-picture-compressor/
├── src/
│   ├── components/
│   │   └── Picture.vue          # Vue component
│   ├── index.ts                 # Module entry point
│   └── vite-plugin.ts           # Vite plugin for compression
├── dist/                        # Built files (created after build)
├── example/                     # Usage example
├── package.json
├── vite.config.ts              # Module build configuration
├── vite.config.plugin.ts       # Plugin build configuration
└── tsconfig.json               # TypeScript configuration
```
