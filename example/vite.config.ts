import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vuePictureCompressor } from '../src/vite-plugin'

export default defineConfig({
  plugins: [
    vue(),
    vuePictureCompressor({
      compression: {
        quality: 80, // 20% сжатие
        jpegQuality: 80,
        pngQuality: [0.6, 0.8],
        webp: true,
        webpQuality: 80,
        svgo: true
      },
      include: /\.(jpg|jpeg|png|webp|svg)$/i,
      exclude: /node_modules/
    })
  ]
})



