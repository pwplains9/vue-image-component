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
      external: ['vite', 'imagemin', 'imagemin-mozjpeg', 'imagemin-pngquant', 'imagemin-webp', 'imagemin-svgo', 'fs', 'path', 'url'],
      output: {
        globals: {
          vite: 'Vite'
        }
      }
    }
  }
})



