import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  Transport,
  type MicroserviceOptions,
} from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,

      options: {
        client: {
          clientId: 'mediaforge-worker',
          brokers: ['localhost:9092'],
        },

        consumer: {
          groupId: 'mediaforge-workers',
        },
      },
    },
  )
  await app.listen();
}
await bootstrap();
