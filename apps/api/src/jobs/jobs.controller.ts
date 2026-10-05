import { Body, Controller, HttpStatus, ParseFilePipeBuilder, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { JobsService } from './jobs.service.js';
import { CreateJobDto, OutputFormat } from './dto/create-job.dto.js';

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
        ) file: Express.Multer.File,
        @Body() dto: CreateJobDto
    ): Promise<StreamableFile>  {
        console.log('[JobsController] POST /jobs');
        // console.log('[JobsController] dto:', dto);
        // console.log('[JobsController] file:', {
        //     originalName: file?.originalname,
        //     mimetype: file?.mimetype,
        //     size: file?.size,
        //   });
          
        const outputBuffer = await this.jobsService.create(dto, file);
        
        return new StreamableFile(outputBuffer, {
            type: this.getMimeType(dto.outputFormat),
            disposition: `attachment; filename="processed.${dto.outputFormat}"`,
          });
        // return this.jobsService.create(dto, file);
    }

    private getMimeType(format: OutputFormat): string {
        switch (format) {
          case OutputFormat.JPEG:
            return 'image/jpeg';
    
          case OutputFormat.PNG:
            return 'image/png';
    
          case OutputFormat.WEBP:
            return 'image/webp';
        }
      }
}
