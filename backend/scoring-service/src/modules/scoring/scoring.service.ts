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
import { ExtraType, DismissalType, InningsStatus, MatchStatus, WinType } from '../../../../shared/enums';

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
        // Idempotency check using clientBallId (assume it's in ballData)
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

  async start(matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');
    match.status = MatchStatus.LIVE;
    await match.save();
    return match;
  }

  async recordBall(data: any) {
    const { matchId, inningsId, batsmanId, bowlerId, runs, extraType, isWicket, wicketData } = data;

    const match = await this.matchModel.findById(matchId);
    const innings = await this.inningsModel.findById(inningsId);
    if (!innings || !match) throw new NotFoundException('Innings or Match not found');

    const stateBefore = innings.toObject();

    // 1. Calculate runs
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

    const totalBallRuns = batsmanRuns + extraRuns;

    // 2. Update Innings totals
    innings.totalRuns += totalBallRuns;
    if (isLegal) {
      innings.totalBalls += 1;
      innings.totalOvers = Math.floor(innings.totalBalls / 6) + (innings.totalBalls % 6) / 10;
    }

    // 3. Update Batsman stats
    let batsman = innings.battingOrder.find(b => b.batsman.toString() === batsmanId);
    if (!batsman) {
      batsman = { batsman: new Types.ObjectId(batsmanId), runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false };
      innings.battingOrder.push(batsman);
    }
    batsman.runs += batsmanRuns;
    if (extraType !== ExtraType.WIDE) batsman.balls += 1;
    if (runs === 4) batsman.fours += 1;
    if (runs === 6) batsman.sixes += 1;
    batsman.strikeRate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;

    // 4. Update Bowler stats
    let bowler = innings.bowlingOrder.find(b => b.bowler.toString() === bowlerId);
    if (!bowler) {
      bowler = { bowler: new Types.ObjectId(bowlerId), runs: 0, balls: 0, wickets: 0, overs: 0, maidens: 0 };
      innings.bowlingOrder.push(bowler);
    }
    const bowlerConceded = (extraType === ExtraType.BYE || extraType === ExtraType.LEG_BYE) ? 0 : totalBallRuns;
    bowler.runs += bowlerConceded;
    if (isLegal) {
      bowler.balls += 1;
      bowler.overs = Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10;
    }
    bowler.economy = bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)) : 0;

    // 5. Handle Wicket
    if (isWicket) {
      innings.totalWickets += 1;
      batsman.isOut = true;
      batsman.dismissal = wicketData;
      if (wicketData.type !== DismissalType.RUN_OUT && wicketData.type !== DismissalType.RETIRED_HURT) {
        bowler.wickets += 1;
      }
      innings.fallOfWickets.push({
        wicketNumber: innings.totalWickets,
        runs: innings.totalRuns,
        overs: innings.totalOvers,
        batsman: batsmanId,
      });

      this.gateway.broadcastWicket(matchId, { innings, wicketData });
      this.client.emit('send_notification', {
        recipient: 'topic_match_' + matchId,
        title: 'Wicket!',
        body: `Player is out! ${innings.totalRuns}/${innings.totalWickets}`,
      });
    }

    // 6. Handle Strike Rotation
    if (runs % 2 !== 0) {
      const temp = innings.currentBatsmen.striker;
      innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
      innings.currentBatsmen.nonStriker = temp;
    }

    // 7. Over completion
    if (isLegal && innings.totalBalls % 6 === 0) {
      const temp = innings.currentBatsmen.striker;
      innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
      innings.currentBatsmen.nonStriker = temp;
      this.gateway.server.to(matchId).emit('over-completed', { overNumber: innings.totalOvers, bowlerId });
    }

    if (extraType !== ExtraType.NO_BALL) innings.isFreeHit = false;

    // 8. Check Innings End Conditions
    const maxOvers = match.options.totalOvers;
    const maxWickets = match.options.playersPerSide - 1;

    if (innings.totalOvers >= maxOvers || innings.totalWickets >= maxWickets) {
      innings.status = InningsStatus.COMPLETED;
    }

    if (innings.inningsNumber === 2 && innings.target && innings.totalRuns >= innings.target) {
      innings.status = InningsStatus.COMPLETED;
    }

    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);

    const ball = new this.ballModel({
      match: matchId,
      innings: inningsId,
      overNumber: Math.floor((innings.totalBalls - (isLegal ? 1 : 0)) / 6),
      ballNumber: innings.totalBalls,
      ballInOver: (innings.totalBalls % 6) || 6,
      batsman: batsmanId,
      nonStriker: innings.currentBatsmen.nonStriker,
      bowler: bowlerId,
      runs,
      batsmanRuns,
      extraRuns,
      totalRuns: totalBallRuns,
      extraType,
      isWicket,
      wicket: wicketData,
      isLegal,
      isFreeHit: stateBefore.isFreeHit,
      stateBefore,
      clientBallId: data.clientBallId,
    });
    await ball.save();

    // 9. Match End Logic
    if (innings.status === InningsStatus.COMPLETED) {
      if (innings.inningsNumber === 2) {
        await this.calculateMatchResult(match, innings);
      }
    }

    this.gateway.broadcastScoreUpdate(matchId, innings);
    this.client.emit('ball_recorded', ball);

    return innings;
  }

  async calculateMatchResult(match: any, secondInnings: any) {
    const firstInnings = await this.inningsModel.findOne({ match: match._id, inningsNumber: 1 });
    let winnerId = null;
    let resultText = '';
    let winType = WinType.NO_RESULT;
    let winMargin = 0;

    if (secondInnings.totalRuns >= secondInnings.target) {
      winnerId = secondInnings.battingTeam;
      winType = WinType.WICKETS;
      winMargin = match.options.playersPerSide - 1 - secondInnings.totalWickets;
      resultText = `Team B won by ${winMargin} wickets`;
    } else if (secondInnings.status === InningsStatus.COMPLETED) {
      if (secondInnings.totalRuns < firstInnings.totalRuns) {
        winnerId = firstInnings.battingTeam;
        winType = WinType.RUNS;
        winMargin = firstInnings.totalRuns - secondInnings.totalRuns;
        resultText = `Team A won by ${winMargin} runs`;
      } else {
        winType = WinType.TIE;
        resultText = 'Match Tied';
      }
    }

    match.status = MatchStatus.COMPLETED;
    match.result = { winner: winnerId, resultText, winMargin, winType };
    await match.save();
    this.gateway.broadcastMatchEnd(match._id.toString(), match);
    this.client.emit('match_completed', { matchId: match._id, result: match.result });

    this.client.emit('send_notification', {
      recipient: 'topic_match_' + match._id,
      title: 'Match Completed!',
      body: resultText,
    });
  }

  async selectBatsman(matchId: string, data: any) {
    const innings = await this.getCurrentState(matchId);
    if (data.isStriker) innings.currentBatsmen.striker = new Types.ObjectId(data.batsmanId);
    else innings.currentBatsmen.nonStriker = new Types.ObjectId(data.batsmanId);
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    this.gateway.server.to(matchId).emit('batsman-changed', innings.currentBatsmen);
    return innings;
  }

  async selectBowler(matchId: string, data: any) {
    const innings = await this.getCurrentState(matchId);
    innings.currentBowler = new Types.ObjectId(data.bowlerId);
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    this.gateway.server.to(matchId).emit('bowler-changed', { bowlerId: data.bowlerId });
    return innings;
  }

  async swapBatsmen(matchId: string) {
    const innings = await this.getCurrentState(matchId);
    const temp = innings.currentBatsmen.striker;
    innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
    innings.currentBatsmen.nonStriker = temp;
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    this.gateway.server.to(matchId).emit('batsman-changed', innings.currentBatsmen);
    return innings;
  }

  async undoBall(matchId: string) {
    const lastBall = await this.ballModel.findOne({ match: matchId }).sort({ createdAt: -1 });
    if (!lastBall) return { success: false, message: 'No ball to undo' };

    const innings = await this.inningsModel.findById(lastBall.innings);
    Object.assign(innings, lastBall.stateBefore);
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);

    await lastBall.deleteOne();

    this.gateway.broadcastScoreUpdate(matchId, innings);
    this.gateway.server.to(matchId).emit('undo-ball', { matchId });
    return innings;
  }

  async startInnings(matchId: string, data: any) {
    const firstInnings = await this.inningsModel.findOne({ match: matchId, inningsNumber: 1 });
    const target = firstInnings ? firstInnings.totalRuns + 1 : undefined;

    const innings = new this.inningsModel({
      match: matchId,
      ...data,
      target,
      status: InningsStatus.IN_PROGRESS,
    });
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);

    await this.matchModel.findByIdAndUpdate(matchId, { currentInnings: data.inningsNumber });
    this.gateway.server.to(matchId).emit('innings-started', innings);
    return innings;
  }

  async getCurrentState(matchId: string) {
    const cachedState = await this.cacheManager.get(`match_state_${matchId}`);
    if (cachedState) return cachedState as any;

    const state = await this.inningsModel.findOne({ match: matchId }).sort({ inningsNumber: -1 }).exec();
    if (state) {
      await this.cacheManager.set(`match_state_${matchId}`, state, 30);
    }
    return state;
  }

  async addPenalty(matchId: string, runs: number) {
    const innings = await this.getCurrentState(matchId);
    innings.totalRuns += runs;
    innings.extras.penalty += runs;
    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    this.gateway.broadcastScoreUpdate(matchId, innings);
    return innings;
  }

  async endMatch(matchId: string, data: any) {
    const match = await this.matchModel.findByIdAndUpdate(matchId, {
      status: MatchStatus.COMPLETED,
      result: data.result,
    }, { new: true });
    this.gateway.broadcastMatchEnd(matchId, match);
    return match;
  }
}
