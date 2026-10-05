export enum ImageOutputFormat {
    JPEG = 'jpeg',
    PNG = 'png',
    WEBP = 'webp',
  }
  
  export interface ImageProcessingOptions {
    width: number;
    height: number;
    outputFormat: ImageOutputFormat;
    quality: number;
  }