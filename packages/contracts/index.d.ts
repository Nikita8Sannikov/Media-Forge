export interface JobProcessRequestedEvent {
    jobId: string;
    inputObjectKey: string;
  
    width: number;
    height: number;
  
    outputFormat: 'jpeg' | 'png' | 'webp';
    quality: number;
  }