import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JobsModule } from './jobs/jobs.module.js';
import { ImageProcessingModule } from './image-processing/image-processing.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
   JobsModule, PrismaModule, ImageProcessingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
