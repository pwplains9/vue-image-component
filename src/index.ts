import Picture from './components/Picture.vue'
import type { App } from 'vue'
import type { PictureProps } from './components/Picture.vue.d.ts'

export { Picture }
export type { PictureProps }
export { vuePictureCompressor } from './vite-plugin'
export type { VuePictureCompressorOptions, CompressionOptions } from './vite-plugin'

export default {
  install(app: App) {
    app.component('Picture', Picture)
  }
}

