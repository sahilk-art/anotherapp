import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ScoringGateway } from './scoring.gateway';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { Match, MatchSchema } from './schemas/match.schema';
import { Innings, InningsSchema } from './schemas/innings.schema';
import { Ball, BallSchema } from './schemas/ball.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Innings.name, schema: InningsSchema },
      { name: Ball.name, schema: BallSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your_access_secret',
      signOptions: { expiresIn: '15m' },
    }),
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
  controllers: [ScoringController],
  providers: [ScoringGateway, ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
