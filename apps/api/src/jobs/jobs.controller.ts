import { Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service.js';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    create() {
        return this.jobsService.create();
    }
}
