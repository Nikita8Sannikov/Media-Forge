import { Inject, Injectable } from '@nestjs/common';
import { JOBS_PROCESS_REQUESTED_TOPIC, KAFKA_CLIENT } from '../kafka.constants.js';
import type { ClientKafkaProxy } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: ClientKafkaProxy,
  ) {}
  publishJobProcessRequested(event: {
    jobId: string;
    inputObjectKey: string;
    width: number;
    height: number;
    outputFormat: string;
    quality: number;
  }): void {
    this.client.emit(JOBS_PROCESS_REQUESTED_TOPIC, event);
  }
}
