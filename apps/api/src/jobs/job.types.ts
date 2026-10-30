// import { ImageOutputFormat } from '../image-processing/image-processing.types.js';

export enum JobStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ImageOutputFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
}

// export interface Job {
//   id: string;
//   status: JobStatus;

//   originalFileName: string;
//   outputFormat: ImageOutputFormat;

//   width: number;
//   height: number;
//   quality: number;

//   outputSize?: number;
// }