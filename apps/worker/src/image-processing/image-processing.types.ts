import type {
  ImageOutputFormat,
} from '@mediaforge/contracts';

  export interface ImageProcessingOptions {
    width: number;
    height: number;
    outputFormat: ImageOutputFormat;
    quality: number;
  }