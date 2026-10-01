import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsService {
    create() {
        return {
            id: 'temporary-id',
            status: 'created',
        }
    }
}
