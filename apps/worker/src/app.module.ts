import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { ObjectStorageService } from './object-storage/object-storage.service.js';
import { ImageProcessingService } from './image-processing/image-processing.service.js';
import { KafkaModule } from './kafka/kafka.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ObjectStorageService, ImageProcessingService],
})
export class AppModule {}
