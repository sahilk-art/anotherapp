import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User, UserSchema } from './schemas/user.schema';
import { Team, TeamSchema } from './schemas/team.schema';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';
import { Match, MatchSchema } from './schemas/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Team', schema: TeamSchema },
      { name: 'Tournament', schema: TournamentSchema },
      { name: 'Match', schema: MatchSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
