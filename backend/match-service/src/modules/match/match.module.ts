import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { Innings, InningsSchema } from './schemas/innings.schema';
import { Ball, BallSchema } from './schemas/ball.schema';
import { MomVote, MomVoteSchema } from './schemas/mom-vote.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Innings.name, schema: InningsSchema },
      { name: Ball.name, schema: BallSchema },
      { name: MomVote.name, schema: MomVoteSchema },
    ]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'match_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
