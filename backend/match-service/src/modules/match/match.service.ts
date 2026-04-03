import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Innings } from './schemas/innings.schema';
import { ClientProxy } from '@nestjs/microservices';
import { MatchStatus, MatchType, TossDecision } from '../../../../../shared/enums';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  async getOgMetadata(id: string): Promise<string> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Match ID');
    const match = await this.matchModel.findById(id).exec();
    if (!match) throw new NotFoundException('Match not found');

    return `
      <html>
        <head>
          <meta property="og:title" content="${match.matchTitle || 'Cricket Match'}" />
          <meta property="og:description" content="${(match as any).teamA?.teamName || 'Team A'} vs ${(match as any).teamB?.teamName || 'Team B'} - Live Score" />
          <meta property="og:image" content="https://api.cricheroes.com/v1/matches/${id}/og-image" />
        </head>
        <body>Redirecting...</body>
      </html>
    `;
  }

  async getOgImage(id: string): Promise<{ url: string }> {
    // In production, this would use a library like node-canvas or satori to generate a real-time scorecard image
    return { url: `https://cdn.cricheroes.com/og/match_${id}.png` };
  }

  async exportMatchPdf(id: string): Promise<{ url: string }> {
    // This would trigger a PDF generation job via a dedicated reporting microservice or lambda function
    return { url: `https://s3.amazonaws.com/reports/match_${id}.pdf` };
  }

  async exportMatchExcel(id: string): Promise<{ url: string }> {
    // This would trigger an Excel generation job
    return { url: `https://s3.amazonaws.com/reports/match_${id}.xlsx` };
  }

  async create(data: Partial<Match>): Promise<Match> {
    const createdMatch = new this.matchModel(data);
    const match = await createdMatch.save();
    this.client.emit('match_created', { matchId: match._id, teamA: match.teamA, teamB: match.teamB });
    return match;
  }

  async findAll(query: { status?: MatchStatus; limit?: number; offset?: number }): Promise<Match[]> {
    const { status, limit = 20, offset = 0 } = query;
    const filter = status ? { status } : {};
    return this.matchModel.find(filter).skip(offset).limit(limit).sort({ createdAt: -1 }).populate('teamA.team teamB.team').exec();
  }

  async findLive(): Promise<Match[]> {
    return this.matchModel.find({ status: MatchStatus.LIVE }).populate('teamA.team teamB.team').sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Match> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Match ID');
    const match = await this.matchModel.findById(id).populate('teamA.team teamB.team').exec();
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async update(id: string, data: Partial<Match>): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async getScorecard(id: string): Promise<Innings[]> {
    return this.inningsModel.find({ match: id }).sort({ inningsNumber: 1 }).exec();
  }

  async setToss(id: string, toss: { winner: string; decision: TossDecision }): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(id, { toss }, { new: true }).exec();
    if (!match) throw new NotFoundException('Match not found');
    this.client.emit('match_toss_set', { matchId: id, toss });
    return match;
  }

  async updateStatus(id: string, status: MatchStatus): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!match) throw new NotFoundException('Match not found');
    this.client.emit('match_status_updated', { matchId: id, status });
    return match;
  }
}
