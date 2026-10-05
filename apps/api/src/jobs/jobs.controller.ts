import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    create(@Body() dto: CreateJobDto) {
        console.log('[JobsController] POST /jobs');
        console.log('[JobsController] dto:', dto);
        return this.jobsService.create(dto);
    }
}
