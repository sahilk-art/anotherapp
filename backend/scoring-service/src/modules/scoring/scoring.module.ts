import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScoringGateway } from './scoring.gateway';
import { ScoringService } from './scoring.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'scoring_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [ScoringGateway, ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
