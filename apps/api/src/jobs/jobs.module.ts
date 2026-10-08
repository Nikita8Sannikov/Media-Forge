import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { ImageProcessingModule } from '../image-processing/image-processing.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ImageProcessingModule, PrismaModule],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
