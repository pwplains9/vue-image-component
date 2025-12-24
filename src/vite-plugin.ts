import type { Plugin } from 'vite'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import { readFileSync, existsSync } from 'fs'
import { extname } from 'path'

export interface CompressionOptions {
  quality?: number // 0-100, quality percentage (100 - no compression, 0 - maximum compression)
  jpegQuality?: number // Quality for JPEG (0-100)
  pngQuality?: [number, number] // Quality for PNG [min, max] (0-1)
  webp?: boolean // Whether to create WebP versions
  webpQuality?: number // Quality for WebP (0-100)
  svgo?: boolean // Whether to optimize SVG
}

export interface VuePictureCompressorOptions {
  compression?: CompressionOptions
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}

const defaultOptions: Required<CompressionOptions> = {
  quality: 80,
  jpegQuality: 80,
  pngQuality: [0.6, 0.8],
  webp: true,
  webpQuality: 80,
  svgo: true
}

function shouldProcessFile(filePath: string, include?: string | RegExp | (string | RegExp)[], exclude?: string | RegExp | (string | RegExp)[]): boolean {
  // Check exclusions
  if (exclude) {
    const excludes = Array.isArray(exclude) ? exclude : [exclude]
    for (const pattern of excludes) {
      if (typeof pattern === 'string' && filePath.includes(pattern)) return false
      if (pattern instanceof RegExp && pattern.test(filePath)) return false
    }
  }

  // Check inclusions
  if (include) {
    const includes = Array.isArray(include) ? include : [include]
    for (const pattern of includes) {
      if (typeof pattern === 'string' && filePath.includes(pattern)) return true
      if (pattern instanceof RegExp && pattern.test(filePath)) return true
    }
    return false
  }

  return true
}

export function vuePictureCompressor(options: VuePictureCompressorOptions = {}): Plugin {
  const compressionOptions = { ...defaultOptions, ...options.compression }
  const { include, exclude } = options

  return {
    name: 'vue-picture-compressor',
    enforce: 'pre',
    async generateBundle(_options: any, bundle: any) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
      const processedFiles = new Set<string>()

      for (const [, chunk] of Object.entries(bundle)) {
        if (!chunk || typeof chunk !== 'object' || !('type' in chunk)) continue
        if ((chunk as any).type !== 'asset') continue

        const asset = chunk as any
        const ext = extname(asset.fileName).toLowerCase()

        if (!imageExtensions.includes(ext)) continue
        if (!shouldProcessFile(asset.fileName, include, exclude)) continue
        if (processedFiles.has(asset.fileName)) continue

        try {
          let imageBuffer: Uint8Array
          
          if (typeof asset.source === 'string') {
            // If it's base64 or data URL
            if (asset.source.startsWith('data:')) {
              const base64Data = asset.source.split(',')[1]
              imageBuffer = Buffer.from(base64Data, 'base64')
            } else {
              // If it's a file path
              const filePath = asset.source
              if (existsSync(filePath)) {
                imageBuffer = readFileSync(filePath)
              } else {
                continue
              }
            }
          } else {
            imageBuffer = asset.source
          }

          let compressedBuffer: Uint8Array | null = null

          // Compression based on file type
          if (ext === '.jpg' || ext === '.jpeg') {
            compressedBuffer = await imagemin.buffer(Buffer.from(imageBuffer), {
              plugins: [
                imageminMozjpeg({
                  quality: compressionOptions.jpegQuality || compressionOptions.quality
                })
              ]
            })
          } else if (ext === '.png') {
            compressedBuffer = await imagemin.buffer(Buffer.from(imageBuffer), {
              plugins: [
                imageminPngquant({
                  quality: compressionOptions.pngQuality || [0.6, 0.8]
                })
              ]
            })

            // Create WebP version if enabled
            if (compressionOptions.webp) {
              const webpBuffer = await imagemin.buffer(Buffer.from(imageBuffer), {
                plugins: [
                  imageminWebp({
                    quality: compressionOptions.webpQuality || compressionOptions.quality
                  })
                ]
              })
              
              const webpFileName = asset.fileName.replace(/\.(png|jpg|jpeg)$/i, '.webp')
              this.emitFile({
                type: 'asset',
                fileName: webpFileName,
                source: webpBuffer
              })
            }
          } else if (ext === '.webp') {
            compressedBuffer = await imagemin.buffer(Buffer.from(imageBuffer), {
              plugins: [
                imageminWebp({
                  quality: compressionOptions.webpQuality || compressionOptions.quality
                })
              ]
            })
          } else if (ext === '.svg' && compressionOptions.svgo) {
            compressedBuffer = await imagemin.buffer(Buffer.from(imageBuffer), {
              plugins: [
                imageminSvgo({
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false
                        }
                      }
                    }
                  ]
                })
              ]
            })
          }

          if (compressedBuffer && compressedBuffer.length < imageBuffer.length) {
            asset.source = compressedBuffer
            processedFiles.add(asset.fileName)
          }
        } catch (error) {
          console.warn(`[vue-picture-compressor] Failed to compress ${asset.fileName}:`, error)
        }
      }
    },
    async buildStart() {
      // Process static assets at build time
    }
  }
}

