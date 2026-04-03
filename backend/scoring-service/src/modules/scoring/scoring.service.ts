import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { CommentaryGenerator } from './commentary.generator';
import { ExtraType, DismissalType, InningsStatus, MatchStatus, WinType, MatchType } from '../../../../../shared/enums';
import { RecordBallDto, UndoBallDto, SelectBatsmanDto, SelectBowlerDto } from '../../../../shared/dto/scoring.dto';

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

  async recordBall(data: RecordBallDto): Promise<Innings> {
    const { matchId, inningsId, runs, extraType, isWicket, wicketType } = data;

    const match = await this.matchModel.findById(matchId).exec();
    const innings = await this.inningsModel.findById(inningsId).exec();
    if (!match || !innings) throw new NotFoundException('Match or Innings not found');
    if (innings.status !== InningsStatus.IN_PROGRESS) throw new BadRequestException('Innings is not in progress');

    const stateBefore = innings.toObject();
    const strikerId = innings.currentBatsmen.striker?.toString();
    const nonStrikerId = innings.currentBatsmen.nonStriker?.toString();
    const bowlerId = innings.currentBowler?.toString();

    if (!strikerId || !bowlerId) throw new BadRequestException('Striker and Bowler must be selected');

    let batsmanRuns = runs;
    let extraRuns = 0;
    let isLegal = true;
    let penaltyRuns = 0;

    // Handle Pair Cricket penalty logic
    if (match.matchType === MatchType.PAIR_CRICKET && isWicket) {
      penaltyRuns = -5;
    }

    // Handle Extras
    if (extraType) {
      switch (extraType) {
        case ExtraType.WIDE:
          extraRuns = 1 + runs;
          batsmanRuns = 0;
          isLegal = false;
          innings.extras.wides += extraRuns;
          break;
        case ExtraType.NO_BALL:
          extraRuns = 1;
          isLegal = false;
          innings.extras.noBalls += extraRuns;
          innings.isFreeHit = true;
          // In NO_BALL, batsman can score runs (batsmanRuns = runs)
          break;
        case ExtraType.BYE:
          extraRuns = runs;
          batsmanRuns = 0;
          innings.extras.byes += extraRuns;
          break;
        case ExtraType.LEG_BYE:
          extraRuns = runs;
          batsmanRuns = 0;
          innings.extras.legByes += extraRuns;
          break;
        case ExtraType.PENALTY:
          penaltyRuns = runs;
          batsmanRuns = 0;
          innings.extras.penalty += penaltyRuns;
          break;
      }
    }

    const totalBallRuns = batsmanRuns + extraRuns + penaltyRuns;
    innings.totalRuns += totalBallRuns;

    if (isLegal) {
      innings.totalBalls += 1;
      const ballsInOver = innings.totalBalls % 6;
      innings.totalOvers = Math.floor(innings.totalBalls / 6) + (ballsInOver / 10);
    }

    // Update Batsman Stats
    let striker = innings.battingOrder.find(b => b.batsman.toString() === strikerId);
    if (!striker) {
      striker = { batsman: new Types.ObjectId(strikerId), runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false };
      innings.battingOrder.push(striker);
    }
    striker.runs += batsmanRuns;
    if (extraType !== ExtraType.WIDE) striker.balls += 1;
    if (runs === 4 && extraType !== ExtraType.BYE && extraType !== ExtraType.LEG_BYE) striker.fours += 1;
    if (runs === 6 && extraType !== ExtraType.BYE && extraType !== ExtraType.LEG_BYE) striker.sixes += 1;

    // Update Bowler Stats
    let currentBowler = innings.bowlingOrder.find(b => b.bowler.toString() === bowlerId);
    if (!currentBowler) {
      currentBowler = { bowler: new Types.ObjectId(bowlerId), runs: 0, balls: 0, wickets: 0, overs: 0, maidens: 0 };
      innings.bowlingOrder.push(currentBowler);
    }
    // Wides and NoBalls count against the bowler's runs
    if (extraType !== ExtraType.BYE && extraType !== ExtraType.LEG_BYE && extraType !== ExtraType.PENALTY) {
      currentBowler.runs += (batsmanRuns + extraRuns);
    }
    if (isLegal) {
      currentBowler.balls += 1;
      currentBowler.overs = Math.floor(currentBowler.balls / 6) + (currentBowler.balls % 6 / 10);
    }

    // Handle Wicket
    if (isWicket) {
      innings.totalWickets += 1;
      if (match.matchType !== MatchType.PAIR_CRICKET) {
        striker.isOut = true;
        striker.dismissal = { type: wicketType as DismissalType, bowler: new Types.ObjectId(bowlerId) };
      }
      if (wicketType !== DismissalType.RUN_OUT && wicketType !== DismissalType.RETIRED_HURT) {
        currentBowler.wickets += 1;
      }
      innings.fallOfWickets.push({
        wicketNumber: innings.totalWickets,
        runs: innings.totalRuns,
        overs: innings.totalOvers,
        batsman: strikerId
      });
      this.client.emit('send_push_notification', {
        topic: `match_${matchId}`,
        title: 'Wicket!',
        body: `Wicket ${innings.totalWickets} down for ${innings.totalRuns} runs.`
      });
    }

    // Handle Strike Rotation (Odd runs or End of Over)
    let finalStrikerId = strikerId;
    let finalNonStrikerId = nonStrikerId;

    if (runs % 2 !== 0) {
      [finalStrikerId, finalNonStrikerId] = [finalNonStrikerId, finalStrikerId];
    }

    if (isLegal && innings.totalBalls % 6 === 0) {
      // Rotate strike at end of over
      [finalStrikerId, finalNonStrikerId] = [finalNonStrikerId, finalStrikerId];
      innings.currentBowler = null; // Bowler must change
      this.gateway.server.to(matchId).emit('over_completed', { over: Math.floor(innings.totalBalls / 6) });
    }

    innings.currentBatsmen.striker = new Types.ObjectId(finalStrikerId);
    innings.currentBatsmen.nonStriker = new Types.ObjectId(finalNonStrikerId);

    if (extraType !== ExtraType.NO_BALL) innings.isFreeHit = false;

    // Check for Innings End
    const maxOvers = match.overs || 20;
    const maxWickets = (match.playersPerSide || 11) - 1;

    if (innings.totalOvers >= maxOvers || (innings.totalWickets >= maxWickets && match.matchType !== MatchType.PAIR_CRICKET)) {
      innings.status = InningsStatus.COMPLETED;
    }

    // Target tracking for 2nd innings
    if (innings.inningsNumber === 2 && innings.totalRuns > (innings.target || 0)) {
       innings.status = InningsStatus.COMPLETED;
    }

    await innings.save();
    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);

    const commentary = CommentaryGenerator.generate({
      batsman: strikerId,
      bowler: bowlerId,
      runs,
      extraType: extraType as ExtraType,
      isWicket,
      wicketType: wicketType as DismissalType
    });

    const ball = new this.ballModel({
      match: new Types.ObjectId(matchId),
      innings: new Types.ObjectId(inningsId),
      overNumber: Math.floor((innings.totalBalls - (isLegal ? 1 : 0)) / 6),
      ballNumber: isLegal ? (innings.totalBalls % 6 || 6) : (innings.totalBalls % 6 + 1),
      batsman: new Types.ObjectId(strikerId),
      bowler: new Types.ObjectId(bowlerId),
      runs: batsmanRuns,
      extras: extraRuns,
      extraType,
      isWicket,
      wicketType,
      stateBefore,
      commentary
    });
    await ball.save();

    this.gateway.broadcastScoreUpdate(matchId, innings);
    this.client.emit('ball_recorded', { ballId: ball._id, matchId, inningsId, totalRuns: innings.totalRuns });

    return innings;
  }

  async start(matchId: string): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(matchId, { status: MatchStatus.LIVE }, { new: true }).exec();
    if (!match) throw new NotFoundException('Match not found');
    this.client.emit('match_started', { matchId });
    return match;
  }

  async startInnings(matchId: string, data: Partial<Innings>): Promise<Innings> {
    const existing = await this.inningsModel.findOne({ match: matchId, inningsNumber: data.inningsNumber }).exec();
    if (existing) throw new BadRequestException('Innings already exists');

    const innings = new this.inningsModel({
      match: new Types.ObjectId(matchId),
      ...data,
      status: InningsStatus.IN_PROGRESS
    });
    await innings.save();
    return innings;
  }

  async getCurrentState(matchId: string): Promise<Innings | null> {
    const cached = await this.cacheManager.get<Innings>(`match_state_${matchId}`);
    if (cached) return cached;

    const state = await this.inningsModel.findOne({ match: matchId }).sort({ inningsNumber: -1 }).exec();
    if (state) await this.cacheManager.set(`match_state_${matchId}`, state, 30);
    return state;
  }

  async undoBall(matchId: string): Promise<Innings | null> {
    const lastBall = await this.ballModel.findOne({ match: new Types.ObjectId(matchId) }).sort({ createdAt: -1 }).exec();
    if (!lastBall) return null;

    const innings = await this.inningsModel.findById(lastBall.innings).exec();
    if (!innings) throw new NotFoundException('Innings not found');

    // Restore state from snapshot
    Object.assign(innings, lastBall.stateBefore);
    await innings.save();
    await lastBall.deleteOne();

    await this.cacheManager.set(`match_state_${matchId}`, innings, 30);
    this.gateway.broadcastScoreUpdate(matchId, innings);
    this.client.emit('ball_undone', { matchId, inningsId: innings._id });

    return innings;
  }

  async selectBatsman(data: SelectBatsmanDto): Promise<Innings> {
    const { matchId, batsmanId, isStriker } = data;
    const update = isStriker ? { 'currentBatsmen.striker': batsmanId } : { 'currentBatsmen.nonStriker': batsmanId };
    const innings = await this.inningsModel.findOneAndUpdate(
      { match: matchId, status: InningsStatus.IN_PROGRESS },
      { $set: update },
      { new: true }
    ).exec();
    if (!innings) throw new NotFoundException('In progress innings not found for match');
    return innings;
  }

  async selectBowler(data: SelectBowlerDto): Promise<Innings> {
    const { matchId, bowlerId } = data;
    const innings = await this.inningsModel.findOneAndUpdate(
      { match: matchId, status: InningsStatus.IN_PROGRESS },
      { $set: { currentBowler: bowlerId } },
      { new: true }
    ).exec();
    if (!innings) throw new NotFoundException('In progress innings not found for match');
    return innings;
  }

  async swapBatsmen(matchId: string): Promise<Innings> {
    const innings = await this.inningsModel.findOne({ match: matchId, status: InningsStatus.IN_PROGRESS }).exec();
    if (!innings) throw new NotFoundException('Active innings not found');

    const temp = innings.currentBatsmen.striker;
    innings.currentBatsmen.striker = innings.currentBatsmen.nonStriker;
    innings.currentBatsmen.nonStriker = temp;

    return innings.save();
  }

  async endMatch(matchId: string, result: string): Promise<Match> {
    const match = await this.matchModel.findByIdAndUpdate(
      matchId,
      { status: MatchStatus.COMPLETED, result },
      { new: true }
    ).exec();
    if (!match) throw new NotFoundException('Match not found');

    await this.inningsModel.updateMany({ match: matchId }, { status: InningsStatus.COMPLETED });
    this.client.emit('match_completed', { matchId, result });
    return match;
  }
}
