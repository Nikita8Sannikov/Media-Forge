import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer/kafka-producer.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from './kafka.constants.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
        transport: Transport.KAFKA,

        options: {
          client: {
            clientId: 'mediaforge-api',
            brokers: ['localhost:9092'],
          },
          // consumer: {
          //   groupId: 'hero-consumer',
          // },
          producerOnlyMode: true,
        },
      },
    ]),
  ],

  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
