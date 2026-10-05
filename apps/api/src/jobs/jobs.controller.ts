import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateJobDto
    ) {
        console.log('[JobsController] POST /jobs');
        console.log('[JobsController] dto:', dto);
        console.log('[JobsController] file:', {
            originalName: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size,
          });
          
        return this.jobsService.create(dto, file);
    }
}
