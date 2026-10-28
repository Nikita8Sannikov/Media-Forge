import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { JobProcessRequestedEvent } from '@mediaforge/contracts';

@Controller()
export class AppController {
  @EventPattern('jobs.process.requested')
  handleJobProcessRequested(
    @Payload() event: JobProcessRequestedEvent,
  ): void {
    console.log(
      '[Worker] received jobs.process.requested:',
      event,
    );
  }
}
