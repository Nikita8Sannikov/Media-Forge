import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import type { JobProcessCompletedEvent } from '@mediaforge/contracts';
import { JobsService } from './jobs.service.js';

const JOBS_PROCESS_COMPLETED_TOPIC = 'jobs.process.completed';

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
}
