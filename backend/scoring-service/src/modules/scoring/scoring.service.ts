import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { Match } from './schemas/match.schema';
import { Innings } from './schemas/innings.schema';
import { Ball } from './schemas/ball.schema';
import { ScoringGateway } from './scoring.gateway';
import { DLSCalculator } from './dls.calculator';
import { ExtraType, DismissalType, InningsStatus, MatchStatus, WinType, MatchType } from '../../../shared/enums';

@Injectable()
export class ScoringService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @InjectModel(Ball.name) private ballModel: Model<Ball>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private gateway: ScoringGateway,
  ) {}

  async syncBulk(matchId: string, balls: any[]) {
    const results = [];
    for (const ballData of balls) {
      try {
        const existing = await this.ballModel.findOne({ clientBallId: ballData.clientBallId });
        if (existing) {
          results.push({ clientBallId: ballData.clientBallId, status: 'SKIPPED' });
          continue;
        }
        await this.recordBall(ballData);
        results.push({ clientBallId: ballData.clientBallId, status: 'SYNCED' });
      } catch (e) {
        results.push({ clientBallId: ballData.clientBallId, status: 'FAILED', error: e.message });
      }
    }
    return results;
  }

  async recordBall(data: any) {
    const { matchId, inningsId, batsmanId, bowlerId, runs, extraType, isWicket, wicketData } = data;
    const match = await this.matchModel.findById(matchId);
    const innings = await this.inningsModel.findById(inningsId);
    if (!innings || !match) throw new NotFoundException('Innings or Match not found');
    const stateBefore = innings.toObject();

    let penaltyRuns = 0;
    if (match.matchType === MatchType.PAIR_CRICKET && isWicket) penaltyRuns = -5;

    let batsmanRuns = runs;
    let extraRuns = 0;
    let isLegal = true;

    if (extraType === ExtraType.WIDE) {
      extraRuns = 1 + runs;
      batsmanRuns = 0;
      isLegal = false;
      innings.extras.wides += extraRuns;
    } else if (extraType === ExtraType.NO_BALL) {
      extraRuns = 1;
      isLegal = false;
      innings.extras.noBalls += extraRuns;
      innings.isFreeHit = true;
    } else if (extraType === ExtraType.BYE) {
      extraRuns = runs;
      batsmanRuns = 0;
      innings.extras.byes += extraRuns;
    } else if (extraType === ExtraType.LEG_BYE) {
      extraRuns = runs;
      batsmanRuns = 0;
      innings.extras.legByes += extraRuns;
    }

    const totalBallRuns = batsmanRuns + extraRuns + penaltyRuns;
    innings.totalRuns += totalBallRuns;

    if (isLegal) {
      innings.totalBalls += 1;
      innings.totalOvers = Math.floor(innings.totalBalls / 6) + (innings.totalBalls % 6) / 10;
    }

    let batsman = innings.battingOrder.find(b => b.batsman.toString() === batsmanId);
    if (!batsman) {
      batsman = { batsman: new Types.ObjectId(batsmanId), runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false };
      innings.battingOrder.push(batsman);
    }
    batsman.runs += batsmanRuns;
    if (extraType !== ExtraType.WIDE) batsman.balls += 1;
    if (runs === 4) batsman.fours += 1;
    if (runs === 6) batsman.sixes += 1;

    let bowler = innings.bowlingOrder.find(b => b.bowler.toString() === bowlerId);
    if (!bowler) {
      bowler = { bowler: new Types.ObjectId(bowlerId), runs: 0, balls: 0, wickets: 0, overs: 0, maidens: 0 };
      innings.bowlingOrder.push(bowler);
    }
    bowler.runs += (extraType === ExtraType.BYE || extraType === ExtraType.LEG_BYE) ? 0 : (totalBallRuns - penaltyRuns);
    if (isLegal) {
      bowler.balls += 1;
      bowler.overs = Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10;
    }

    if (isWicket) {
      innings.totalWickets += 1;
      if (match.matchType !== MatchType.PAIR_CRICKET) {
        batsman.isOut = true;
        batsman.dismissal = wicketData;
      }
      if (wicketData.type !== DismissalType.RUN_OUT && wicketData.type !== DismissalType.RETIRED_HURT) bowler.wickets += 1;
      innings.fallOfWickets.push({ wicketNumber: innings.totalWickets, runs: innings.totalRuns, overs: innings.totalOvers, batsman: batsmanId });
      this.client.emit('send_notification', { recipient: 'match_' + matchId, title: 'Wicket!', body: `Player out at ${innings.totalRuns}` });
    }

    if (runs % 2 !== 0) {
      const temp = innings.currentBatsmen.striker;
      innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
      innings.currentBatsmen.nonStriker = temp;
    }

    if (isLegal && innings.totalBalls % 6 === 0) {
      const temp = innings.currentBatsmen.striker;
      innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
      innings.currentBatsmen.nonStriker = temp;
      this.gateway.server.to(matchId).emit('over-completed', { overNumber: innings.totalOvers });
    }

    if (extraType !== ExtraType.NO_BALL) innings.isFreeHit = false;

    if (innings.totalOvers >= match.options.totalOvers || (innings.totalWickets >= match.options.playersPerSide - 1 && match.matchType !== MatchType.PAIR_CRICKET)) {
      innings.status = InningsStatus.COMPLETED;
    }

    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    const ball = new this.ballModel({ ...data, overNumber: Math.floor(innings.totalBalls / 6), stateBefore });
    await ball.save();
    this.gateway.broadcastScoreUpdate(matchId, innings);
    this.client.emit('ball_recorded', ball);
    return innings;
  }

  async start(matchId: string) {
    return this.matchModel.findByIdAndUpdate(matchId, { status: MatchStatus.LIVE }, { new: true });
  }

  async startInnings(matchId: string, data: any) {
    const innings = new this.inningsModel({ match: matchId, ...data, status: InningsStatus.IN_PROGRESS });
    await innings.save();
    return innings;
  }

  async getCurrentState(matchId: string) {
    const cached = await this.cacheManager.get(`match_state_${matchId}`);
    if (cached) return cached;
    const state = await this.inningsModel.findOne({ match: matchId }).sort({ inningsNumber: -1 }).exec();
    if (state) await this.cacheManager.set(`match_state_${matchId}`, state, 30);
    return state;
  }

  async undoBall(matchId: string) {
    const lastBall = await this.ballModel.findOne({ match: matchId }).sort({ createdAt: -1 });
    if (!lastBall) return null;
    const innings = await this.inningsModel.findById(lastBall.innings);
    Object.assign(innings, lastBall.stateBefore);
    await innings.save();
    await lastBall.deleteOne();
    this.gateway.broadcastScoreUpdate(matchId, innings);
    return innings;
  }

  async selectBatsman(matchId: string, data: any) {
    const update = data.isStriker ? { 'currentBatsmen.striker': data.batsmanId } : { 'currentBatsmen.nonStriker': data.batsmanId };
    return this.inningsModel.findOneAndUpdate({ match: matchId }, update, { new: true });
  }

  async selectBowler(matchId: string, data: any) {
    return this.inningsModel.findOneAndUpdate({ match: matchId }, { currentBowler: data.bowlerId }, { new: true });
  }

  async swapBatsmen(matchId: string) {
    const innings = await this.getCurrentState(matchId) as any;
    const temp = innings.currentBatsmen.striker;
    innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
    innings.currentBatsmen.nonStriker = temp;
    return innings.save();
  }

  async addPenalty(matchId: string, runs: number) {
    return this.inningsModel.findOneAndUpdate({ match: matchId }, { $inc: { totalRuns: runs, 'extras.penalty': runs } }, { new: true });
  }

  async endMatch(matchId: string, data: any) {
    return this.matchModel.findByIdAndUpdate(matchId, { status: MatchStatus.COMPLETED, result: data.result }, { new: true });
  }
}
