import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { ImageProcessingService } from '../image-processing/image-processing.service.js';

@Injectable()
export class JobsService {
    constructor(
        private readonly imageProcessingService: ImageProcessingService,
      ) {}
  async create(dto: CreateJobDto, file: Express.Multer.File): Promise<Buffer> {
    console.log('[2] JobsService.create()');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const outputBuffer = await this.imageProcessingService.process(file.buffer, dto);

    console.log('[6] JobsService got processed Buffer');
    return outputBuffer;
  }
}
