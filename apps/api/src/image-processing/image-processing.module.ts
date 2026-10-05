import { Module } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service.js';

@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService]
})
export class ImageProcessingModule {}
