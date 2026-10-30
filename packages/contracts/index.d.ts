export type ImageOutputFormat = "jpeg" | "png" | "webp";

export interface JobProcessRequestedEvent {
  jobId: string;
  inputObjectKey: string;

  width: number;
  height: number;

  outputFormat: ImageOutputFormat;
  quality: number;
}

export interface JobProcessCompletedEvent {
  jobId: string;
  outputObjectKey: string;
  outputSize: number;
}
