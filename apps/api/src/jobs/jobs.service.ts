import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { ImageProcessingService } from '../image-processing/image-processing.service.js';
import { JobStatus } from './job.types.js';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { Job } from '../generated/prisma/client.js';
import { ObjectStorageService } from '../object-storage/object-storage.service.js';
import { KafkaProducerService } from '../kafka/kafka-producer/kafka-producer.service.js';
import type { JobProcessCompletedEvent } from '@mediaforge/contracts';

@Injectable()
export class JobsService {
  // private readonly jobs = new Map<string, Job>();
  // private readonly outputs = new Map<string, Buffer>();

  constructor(
    private readonly imageProcessingService: ImageProcessingService,
    private readonly prisma: PrismaService,
    private readonly objectStorageService: ObjectStorageService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async create(dto: CreateJobDto, file: Express.Multer.File): Promise<Job> {
    console.log('[JobsService] creating job in PostgreSQL');

    console.log('[JobsService] received file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // const id = randomUUID();

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
      const inputObjectKey = `jobs/${job.id}/input/original`;

      const uploadedInputObjectKey = await this.objectStorageService.putObject(
        inputObjectKey,
        file.buffer,
        file.mimetype,
      );

      console.log('[JobsService] input uploaded:', uploadedInputObjectKey);

      await this.prisma.job.update({
        where: {
          id: job.id,
        },
        data: {
          inputObjectKey: uploadedInputObjectKey,
        },
      });

      this.kafkaProducerService.publishJobProcessRequested({
        jobId: job.id,
        inputObjectKey: uploadedInputObjectKey,
        width: dto.width,
        height: dto.height,
        outputFormat: dto.outputFormat,
        quality: dto.quality,
      });

      const outputBuffer = await this.imageProcessingService.process(
        file.buffer,
        dto,
      );

      // this.outputs.set(id, outputBuffer);
      const outputObjectKey = `jobs/${job.id}/output/processed.${dto.outputFormat}`;

      const uploadedOutputObjectKey = await this.objectStorageService.putObject(
        outputObjectKey,
        outputBuffer,
        `image/${dto.outputFormat}`,
      );

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
          outputObjectKey: uploadedOutputObjectKey,
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

  async getOutput(id: string): Promise<{ job: Job; outputBuffer: Buffer }> {
    // const output = this.outputs.get(id);
    const job = await this.findOne(id);

    if (!job.outputObjectKey) {
      throw new NotFoundException(`Output for job ${id} not found`);
    }

    // if (!output) {
    //   throw new NotFoundException(`Output for job ${id} not found`);
    // }

    const outputBuffer = await this.objectStorageService.getObject(
      job.outputObjectKey,
    );

    // return output;
    return {
      job,
      outputBuffer,
    };
  }

  async handleJobProcessCompleted(
    event: JobProcessCompletedEvent,
  ): Promise<void> {
    await this.prisma.job.update({
      where: {
        id: event.jobId,
      },

      data: {
        status: 'completed',
        outputObjectKey: event.outputObjectKey,
        outputSize: event.outputSize,
      },
    });

    console.log('[JobsService] job completed from worker:', event.jobId);
  }
}
