import { Inject, Injectable } from '@nestjs/common';

import type { ClientKafkaProxy } from '@nestjs/microservices';

import {
  JOBS_PROCESS_COMPLETED_TOPIC,
  KAFKA_PRODUCER_CLIENT,
} from '../kafka.constants.js';
import { JobProcessCompletedEvent } from '@mediaforge/contracts';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject(KAFKA_PRODUCER_CLIENT) //receive inhection token
    private readonly client: ClientKafkaProxy,
  ) {}

  publishJobProcessCompleted(event: JobProcessCompletedEvent): void {
    this.client.emit(JOBS_PROCESS_COMPLETED_TOPIC, event);
  }
}
