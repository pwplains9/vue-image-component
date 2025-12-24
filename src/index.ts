import Picture from './components/Picture.vue'
import type { App } from 'vue'
import type { PictureProps } from './components/Picture.vue.d.ts'

export { Picture }
export type { PictureProps }
// Vite plugin is exported separately via package.json exports

export default {
  install(app: App) {
    app.component('Picture', Picture)
  }
}

