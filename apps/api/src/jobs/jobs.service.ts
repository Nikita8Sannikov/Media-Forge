import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class JobsService {
  create(dto: CreateJobDto, file: Express.Multer.File) {
    console.log('[JobsService] create() started');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const job = {
      id: randomUUID(),
      status: 'created',
      params: dto,
      file: {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    };

    console.log('Buffer size:', file.buffer.length);
    console.log('First bytes:', file.buffer.subarray(0, 10));
    console.log('[JobsService] job created:', job);

    return job;
  }
}
