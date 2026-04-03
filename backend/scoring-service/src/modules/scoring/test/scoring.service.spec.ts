import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from '../scoring.service';
import { getModelToken } from '@nestjs/mongoose';
import { Match } from '../schemas/match.schema';
import { Innings } from '../schemas/innings.schema';
import { Ball } from '../schemas/ball.schema';
import { ScoringGateway } from '../scoring.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Types } from 'mongoose';
import { ExtraType, DismissalType, InningsStatus, MatchType } from '../../../../../../shared/enums';

describe('ScoringService', () => {
  let service: ScoringService;
  let matchModel: any;
  let inningsModel: any;
  let ballModel: any;

  const mockMatch = {
    _id: new Types.ObjectId(),
    overs: 20,
    playersPerSide: 11,
    matchType: MatchType.T20,
  };

  const mockInnings = {
    _id: new Types.ObjectId(),
    status: InningsStatus.IN_PROGRESS,
    totalRuns: 0,
    totalBalls: 0,
    totalWickets: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    currentBatsmen: { striker: new Types.ObjectId(), nonStriker: new Types.ObjectId() },
    currentBowler: new Types.ObjectId(),
    battingOrder: [],
    bowlingOrder: [],
    fallOfWickets: [],
    toObject: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    matchModel = { findById: jest.fn().mockReturnValue({ exec: () => Promise.resolve(mockMatch) }) };
    inningsModel = {
      findById: jest.fn().mockReturnValue({ exec: () => Promise.resolve(mockInnings) }),
      findOne: jest.fn().mockReturnValue({ exec: () => Promise.resolve(mockInnings) }),
      findOneAndUpdate: jest.fn().mockReturnValue({ exec: () => Promise.resolve(mockInnings) }),
    };
    ballModel = jest.fn().mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringService,
        { provide: getModelToken(Match.name), useValue: matchModel },
        { provide: getModelToken(Innings.name), useValue: inningsModel },
        { provide: getModelToken(Ball.name), useValue: ballModel },
        { provide: 'RABBITMQ_SERVICE', useValue: { emit: jest.fn() } },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } },
        { provide: ScoringGateway, useValue: { broadcastScoreUpdate: jest.fn(), server: { to: jest.fn().mockReturnThis(), emit: jest.fn() } } },
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record a normal ball correctly', async () => {
    const data = {
      matchId: mockMatch._id.toString(),
      inningsId: mockInnings._id.toString(),
      runs: 1,
      isWicket: false,
    };

    const result = await service.recordBall(data as any);
    expect(result.totalRuns).toBe(1);
    expect(result.totalBalls).toBe(1);
    expect(mockInnings.save).toHaveBeenCalled();
  });

  it('should rotate strike on odd runs', async () => {
    const strikerBefore = mockInnings.currentBatsmen.striker;
    const nonStrikerBefore = mockInnings.currentBatsmen.nonStriker;

    const data = {
      matchId: mockMatch._id.toString(),
      inningsId: mockInnings._id.toString(),
      runs: 3,
      isWicket: false,
    };

    const result = await service.recordBall(data as any);
    expect(result.currentBatsmen.striker).toEqual(nonStrikerBefore);
    expect(result.currentBatsmen.nonStriker).toEqual(strikerBefore);
  });
});
