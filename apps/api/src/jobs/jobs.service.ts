import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { ImageProcessingService } from '../image-processing/image-processing.service.js';
import { Job, JobStatus } from './job.types.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();
  private readonly outputs = new Map<string, Buffer>();

  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  async create(dto: CreateJobDto, file: Express.Multer.File): Promise<Job> {
    console.log('[2] JobsService.create()');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const id = randomUUID();

    const job: Job = {
      id,
      status: JobStatus.PROCESSING,

      originalFileName: file.originalname,
      outputFormat: dto.outputFormat,

      width: dto.width,
      height: dto.height,
      quality: dto.quality,
    };

    this.jobs.set(id, job);

    console.log('[3] Job created:', job);


    const outputBuffer = await this.imageProcessingService.process(
      file.buffer,
      dto,
    );

    this.outputs.set(id, outputBuffer);

    job.status = JobStatus.COMPLETED;
    job.outputSize = outputBuffer.length;

    console.log('[7] Job completed:', job);

    return job;
  }

  findOne(id: string): Job {
    const job = this.jobs.get(id);

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    return job;
  }

  getOutput(id: string): Buffer {
    const output = this.outputs.get(id);

    if (!output) {
      throw new NotFoundException(`Output for job ${id} not found`);
    }

    return output;
  }
}
