import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KAFKA_PRODUCER_CLIENT } from './kafka.constants.js';
import { KafkaProducerService } from './kafka-producer/kafka-producer.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_PRODUCER_CLIENT, //injection token

        transport: Transport.KAFKA,

        options: {
          client: {
            clientId: 'mediaforge-worker',
            brokers: ['localhost:9092'],
          },

          producerOnlyMode: true, //only for send, not register consumer group
        },
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
