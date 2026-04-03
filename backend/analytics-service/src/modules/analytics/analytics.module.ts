import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { Innings, InningsSchema } from './schemas/innings.schema';
import { Ball, BallSchema } from './schemas/ball.schema';
import { Achievement, AchievementSchema, UserAchievement, UserAchievementSchema } from './schemas/achievement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Innings.name, schema: InningsSchema },
      { name: Ball.name, schema: BallSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: UserAchievement.name, schema: UserAchievementSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
