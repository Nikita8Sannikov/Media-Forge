import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { ImageProcessingService } from '../image-processing/image-processing.service.js';
import { JobStatus } from './job.types.js';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { Job } from '../generated/prisma/client.js';

@Injectable()
export class JobsService {
  // private readonly jobs = new Map<string, Job>();
  private readonly outputs = new Map<string, Buffer>();

  constructor(
    private readonly imageProcessingService: ImageProcessingService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateJobDto, file: Express.Multer.File): Promise<Job> {
    console.log('[JobsService] creating job in PostgreSQL');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const id = randomUUID();

    const job = await this.prisma.job.create({
      data: {
        status: JobStatus.PROCESSING,

        originalFileName: file.originalname,
        outputFormat: dto.outputFormat,

        width: dto.width,
        height: dto.height,
        quality: dto.quality,
      },
    });

    console.log('[JobsService] job created:', job.id);
    try {
      const outputBuffer = await this.imageProcessingService.process(
        file.buffer,
        dto,
      );

      this.outputs.set(id, outputBuffer);

      // job.status = JobStatus.COMPLETED;
      // job.outputSize = outputBuffer.length;

      // console.log('[7] Job completed:', job);

      // return job;
      const completedJob = await this.prisma.job.update({
        where: {
          id: job.id,
        },

        data: {
          status: JobStatus.COMPLETED,
          outputSize: outputBuffer.length,
        },
      });

      console.log('[JobsService] job completed:', completedJob.id);

      return completedJob;
    } catch (error) {
      await this.prisma.job.update({
        where: {
          id: job.id,
        },

        data: {
          status: JobStatus.FAILED,
        },
      });

      throw error;
    }
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: {
        id,
      },
    });
    
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
