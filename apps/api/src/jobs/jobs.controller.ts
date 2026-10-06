import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { ImageOutputFormat } from '../image-processing/image-processing.types.js';
import type { Job } from './job.types.js';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,

    @Body() dto: CreateJobDto,
  ): Promise<Job> {
    console.log('[JobsController] POST /jobs');

    console.log('[1] JobsController.create()');
    const job = await this.jobsService.create(dto, file);

    console.log('[8] Controller got job:', job);

    return job;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Job {
    console.log('[Controller] GET job:', id);

    return this.jobsService.findOne(id);
  }

  @Get(':id/download')
  download(@Param('id') id: string): StreamableFile {
    console.log('[Controller] download job:', id);

    const job = this.jobsService.findOne(id);
    const outputBuffer = this.jobsService.getOutput(id);

    return new StreamableFile(outputBuffer, {
      type: this.getMimeType(job.outputFormat),
      disposition: `attachment; filename="processed.${job.outputFormat}"`,
    });
  }

  private getMimeType(format: ImageOutputFormat): string {
    switch (format) {
      case ImageOutputFormat.JPEG:
        return 'image/jpeg';

      case ImageOutputFormat.PNG:
        return 'image/png';

      case ImageOutputFormat.WEBP:
        return 'image/webp';
    }
  }
}
