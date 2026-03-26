import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leaderboard } from './schemas/leaderboard.schema';

@Injectable()
export class LeaderboardService {
  constructor(@InjectModel(Leaderboard.name) private leaderboardModel: Model<Leaderboard>) {}

  async getGlobal(category: string) {
    return this.leaderboardModel.findOne({ type: 'GLOBAL', category }).exec();
  }

  async getTournament(tournamentId: string, category: string) {
    return this.leaderboardModel.findOne({ type: 'TOURNAMENT', tournament: tournamentId, category }).exec();
  }
}
