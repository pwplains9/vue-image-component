declare module 'imagemin' {
  function imagemin(input: Buffer | Buffer[], options?: any): Promise<Buffer>
  namespace imagemin {
    function buffer(input: Buffer, options?: any): Promise<Buffer>
  }
  export = imagemin
}

declare module 'imagemin-mozjpeg' {
  export default function imageminMozjpeg(options?: any): any
}

declare module 'imagemin-pngquant' {
  export default function imageminPngquant(options?: any): any
}

declare module 'imagemin-webp' {
  export default function imageminWebp(options?: any): any
}

declare module 'imagemin-svgo' {
  export default function imageminSvgo(options?: any): any
}

