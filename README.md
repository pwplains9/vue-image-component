# vue-picture-compressor

Vue 3 component for image optimization with automatic compression at build time.

## Features

- 🖼️ `Picture` component for Vue 3
- 🗜️ Automatic image compression at build time (like TinyPNG)
- ⚙️ Configurable compression percentage
- 🌐 Automatic WebP version generation
- 📦 Easy integration with Vite

## Installation

```bash
npm install vue3-picture-compressor
```

### Requirements

- Vue 3.x
- Vite (for using the compression plugin)
- Node.js 18+ (for building)

## Usage

### 1. Configure Vite Plugin

In your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vuePictureCompressor } from 'vue-picture-compressor/vite-plugin'

export default defineConfig({
  plugins: [
    vue(),
    vuePictureCompressor({
      compression: {
        quality: 80, // Quality percentage (0-100, where 100 is no compression)
        jpegQuality: 80, // Quality for JPEG
        pngQuality: [0.6, 0.8], // Quality for PNG [min, max]
        webp: true, // Create WebP versions
        webpQuality: 80, // Quality for WebP
        svgo: true // Optimize SVG
      },
      include: /\.(jpg|jpeg|png|webp|svg)$/i, // Which files to process
      exclude: /node_modules/ // What to exclude
    })
  ]
})
```

### 2. Using the Component

#### Global Registration

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import VuePictureCompressor from 'vue3-picture-compressor'

const app = createApp(App)
app.use(VuePictureCompressor)
app.mount('#app')
```

#### Local Registration

```vue
<template>
  <Picture
    src="/images/photo.jpg"
    alt="Image description"
    loading="lazy"
    :webp="true"
  />
</template>

<script setup>
import { Picture } from 'vue3-picture-compressor'
</script>
```

## API

### Picture Component

#### Props

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | - | Image path (required) |
| `alt` | `string` | `''` | Alternative text |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy |
| `imgClass` | `string` | `''` | CSS class for img element |
| `imgStyle` | `string \| Record<string, any>` | `{}` | Styles for img element |
| `webp` | `boolean` | `true` | Whether to use WebP version |

#### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `load` | `event: Event` | Emitted when image loads successfully |
| `error` | `event: Event` | Emitted when image loading fails |

### Vite Plugin Options

#### CompressionOptions

```typescript
interface CompressionOptions {
  quality?: number // 0-100, overall quality (100 - no compression)
  jpegQuality?: number // Quality for JPEG (0-100)
  pngQuality?: [number, number] // Quality for PNG [min, max] (0-1)
  webp?: boolean // Whether to create WebP versions
  webpQuality?: number // Quality for WebP (0-100)
  svgo?: boolean // Whether to optimize SVG
}
```

#### VuePictureCompressorOptions

```typescript
interface VuePictureCompressorOptions {
  compression?: CompressionOptions
  include?: string | RegExp | (string | RegExp)[] // Patterns for including files
  exclude?: string | RegExp | (string | RegExp)[] // Patterns for excluding files
}
```

## Examples

### Basic Usage

```vue
<template>
  <Picture src="/assets/hero.jpg" alt="Hero image" />
</template>
```

### With Settings

```vue
<template>
  <Picture
    src="/assets/photo.png"
    alt="Photo"
    :imgClass="'rounded-lg shadow-md'"
    :imgStyle="{ maxWidth: '100%' }"
    loading="eager"
  />
</template>
```

### Event Handling

```vue
<template>
  <Picture
    src="/assets/image.jpg"
    alt="Image"
    @load="onImageLoad"
    @error="onImageError"
  />
</template>

<script setup>
const onImageLoad = (event) => {
  console.log('Image loaded', event)
}

const onImageError = (event) => {
  console.error('Image error', event)
}
</script>
```

### Compression Configuration

```javascript
// vite.config.js
import { vuePictureCompressor } from 'vue-picture-compressor/vite-plugin'

export default defineConfig({
  plugins: [
    vuePictureCompressor({
      compression: {
        quality: 70, // 30% compression
        jpegQuality: 75,
        pngQuality: [0.5, 0.7],
        webp: true,
        webpQuality: 75
      }
    })
  ]
})
```

## How It Works

1. **At build time**: The Vite plugin automatically finds all images in your project and compresses them using optimized algorithms (mozjpeg for JPEG, pngquant for PNG).

2. **WebP versions**: If enabled, WebP versions of images are automatically created for better performance.

3. **Picture component**: Uses the `<picture>` element with fallback to the original format if the browser doesn't support WebP.

## Quality Recommendations

- **90-100**: Minimal compression, high quality (for important images)
- **70-89**: Moderate compression, good quality (recommended)
- **50-69**: Strong compression, acceptable quality (for thumbnails)
- **0-49**: Maximum compression, low quality (not recommended)

## License

MIT

## Support

If you have questions or suggestions, please create an issue in the [GitHub repository](https://github.com/pwplains9/vue-picture-compressor).
