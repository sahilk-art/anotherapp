import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { PlayerCareerStats, PlayerCareerStatsSchema } from './schemas/player-career-stats.schema';
import { PlayerReview, PlayerReviewSchema } from './schemas/player-review.schema';
import { PracticeSession, PracticeSessionSchema } from './schemas/practice-session.schema';
import { FAQ, FAQSchema } from './schemas/faq.schema';
import { BugReport, BugReportSchema } from './schemas/bug-report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: PlayerCareerStats.name, schema: PlayerCareerStatsSchema },
      { name: PlayerReview.name, schema: PlayerReviewSchema },
      { name: PracticeSession.name, schema: PracticeSessionSchema },
      { name: FAQ.name, schema: FAQSchema },
      { name: BugReport.name, schema: BugReportSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
