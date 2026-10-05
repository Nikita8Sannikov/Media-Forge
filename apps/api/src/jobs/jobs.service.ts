import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { randomUUID } from 'node:crypto';

@Injectable()
export class JobsService {
    create(dto: CreateJobDto) {
        console.log('[JobsService] create() started');

        const job = {
          id: randomUUID(),
          status: 'created',
          params: dto,
        };
    
        console.log('[JobsService] job created:', job);
    
        return job;
    }
}
