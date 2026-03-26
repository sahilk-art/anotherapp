import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Innings } from './schemas/innings.schema';
import { ClientProxy } from '@nestjs/microservices';
import { MatchStatus } from '../../../shared/enums';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  async create(data: any): Promise<Match> {
    const createdMatch = new this.matchModel(data);
    const match = await createdMatch.save();
    this.client.emit('match_created', match);
    return match;
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().populate('teamA.team teamB.team').exec();
  }

  async findLive(): Promise<Match[]> {
    return this.matchModel.find({ status: MatchStatus.LIVE }).exec();
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchModel.findById(id).populate('teamA.team teamB.team').exec();
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async update(id: string, data: any): Promise<Match> {
    return this.matchModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getScorecard(id: string) {
    const innings = await this.inningsModel.find({ match: id }).exec();
    return innings;
  }

  async setToss(id: string, data: any) {
    return this.matchModel.findByIdAndUpdate(id, { toss: data.toss }, { new: true }).exec();
  }

  async updateStatus(id: string, status: MatchStatus): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    this.client.emit('match_status_updated', match);
    return match;
  }
}
