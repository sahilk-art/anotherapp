import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leaderboard, LeaderboardSchema } from './schemas/leaderboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Leaderboard.name, schema: LeaderboardSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class LeaderboardModule {}
