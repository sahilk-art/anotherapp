import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Team') private teamModel: Model<any>,
    @InjectModel('Tournament') private tournamentModel: Model<any>,
    @InjectModel('Match') private matchModel: Model<any>,
  ) {}

  async universal(q: string, type: string) {
    const regex = new RegExp(q, 'i');
    const results = {
      players: [],
      teams: [],
      tournaments: [],
      matches: []
    };

    if (!type || type === 'players') results.players = await this.userModel.find({ fullName: regex }).limit(5).exec();
    if (!type || type === 'teams') results.teams = await this.teamModel.find({ name: regex }).limit(5).exec();
    if (!type || type === 'tournaments') results.tournaments = await this.tournamentModel.find({ name: regex }).limit(5).exec();
    if (!type || type === 'matches') results.matches = await this.matchModel.find({ matchTitle: regex }).limit(5).exec();

    return results;
  }
}
