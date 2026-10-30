import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { JobProcessRequestedEvent } from '@mediaforge/contracts';
import { ObjectStorageService } from './object-storage/object-storage.service.js';
import { ImageProcessingService } from './image-processing/image-processing.service.js';
import { KafkaProducerService } from './kafka/kafka-producer/kafka-producer.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly objectStorageService: ObjectStorageService,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}
  @EventPattern('jobs.process.requested')
  async handleJobProcessRequested(
    @Payload() event: JobProcessRequestedEvent,
  ): Promise<void> {
    console.log('[Worker] received job:', event.jobId);

    const inputBuffer = await this.objectStorageService.getObject(
      event.inputObjectKey,
    );

    console.log('[Worker] input downloaded:', {
      jobId: event.jobId,
      size: inputBuffer.length,
    });

    const outputBuffer = await this.imageProcessingService.process(
      inputBuffer,
      {
        width: event.width,
        height: event.height,
        outputFormat: event.outputFormat,
        quality: event.quality,
      },
    );

    console.log('[Worker] image processed:', {
      jobId: event.jobId,
      inputSize: inputBuffer.length,
      outputSize: outputBuffer.length,
    });

    const outputObjectKey = `jobs/${event.jobId}/output/processed.${event.outputFormat}`;

    const uploadedOutputObjectKey = await this.objectStorageService.putObject(
      outputObjectKey,
      outputBuffer,
      `image/${event.outputFormat}`,
    );

    console.log('[Worker] output uploaded:', {
      jobId: event.jobId,
      outputObjectKey: uploadedOutputObjectKey,
      size: outputBuffer.length,
    });

    this.kafkaProducerService.publishJobProcessCompleted({
      jobId: event.jobId,
      outputObjectKey: uploadedOutputObjectKey,
      outputSize: outputBuffer.length,
    });
  }
}
