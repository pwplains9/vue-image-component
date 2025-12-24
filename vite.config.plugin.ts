import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vite-plugin.ts'),
      name: 'VuePictureCompressorPlugin',
      fileName: (format) => `vite-plugin.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: (id) => {
        // Externalize all Node.js built-ins
        if (id.startsWith('node:') || ['fs', 'path', 'url', 'util', 'os', 'stream', 'child_process', 'assert', 'constants', 'buffer'].includes(id)) {
          return true
        }
        // Externalize vite and imagemin packages
        if (id === 'vite' || id.startsWith('imagemin') || id.startsWith('@vitejs')) {
          return true
        }
        // Externalize all node_modules (dependencies)
        if (!id.startsWith('.') && !id.startsWith('/') && !id.includes(':')) {
          return true
        }
        return false
      },
      output: {
        globals: {
          vite: 'Vite'
        },
        banner: '/* eslint-disable */',
        footer: '/* eslint-enable */'
      }
    },
    ssr: true,
    target: 'node18'
  }
})



