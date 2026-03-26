import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
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
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
