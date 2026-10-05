import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JobsModule } from './jobs/jobs.module.js';
import { ImageProcessingModule } from './image-processing/image-processing.module.js';

@Module({
  imports: [JobsModule, ImageProcessingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
