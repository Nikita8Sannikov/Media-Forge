import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import type {
  JobProcessCompletedEvent,
  JobProcessFailedEvent,
} from '@mediaforge/contracts';
import { JobsService } from './jobs.service.js';
import {
  JOBS_PROCESS_COMPLETED_TOPIC,
  JOBS_PROCESS_FAILED_TOPIC,
} from '../kafka/kafka.constants.js';

@Controller()
export class JobsEventsController {
  constructor(private readonly jobsService: JobsService) {}

  @EventPattern(JOBS_PROCESS_COMPLETED_TOPIC)
  async handleJobProcessCompleted(
    @Payload() event: JobProcessCompletedEvent,
  ): Promise<void> {
    console.log('[JobsEventsController] job process completed:', event);

    await this.jobsService.handleJobProcessCompleted(event);
  }

  @EventPattern(JOBS_PROCESS_FAILED_TOPIC)
  async handleJobProcessFailed(
    @Payload() event: JobProcessFailedEvent,
  ): Promise<void> {
    console.log('[JobsEventsController] job process failed:', event);

    await this.jobsService.handleJobProcessFailed(event);
  }
}
