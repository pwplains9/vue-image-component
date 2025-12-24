import { DefineComponent } from 'vue'

export interface PictureProps {
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
  imgClass?: string
  imgStyle?: string | Record<string, any>
  webp?: boolean
}

declare const Picture: DefineComponent<PictureProps>

export default Picture
export type { PictureProps }

