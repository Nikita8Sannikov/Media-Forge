import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
// import { ImageProcessingModule } from '../image-processing/image-processing.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ObjectStorageModule } from '../object-storage/object-storage.module.js';
import { KafkaProducerService } from '../kafka/kafka-producer/kafka-producer.service.js';
import { KafkaModule } from '../kafka/kafka.module.js';
import { JobsEventsController } from './jobs-events.controller.js';

@Module({
  imports: [PrismaModule, ObjectStorageModule, KafkaModule],
  controllers: [JobsController, JobsEventsController],
  providers: [JobsService],
})
export class JobsModule {}
