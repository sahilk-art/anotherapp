import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament } from './schemas/tournament.schema';
import { RoundType, TournamentStatus } from '../../../../../shared/enums';
import { calculateNRR, IMatchResult, oversToDecimal } from '../../../../shared/utils/cricket-math';

@Injectable()
export class TournamentService {
  constructor(@InjectModel(Tournament.name) private tournamentModel: Model<Tournament>) {}

  async create(data: Partial<Tournament>): Promise<Tournament> {
    const createdTournament = new this.tournamentModel(data);
    return createdTournament.save();
  }

  async findAll(query: { status?: TournamentStatus; limit?: number; offset?: number }): Promise<Tournament[]> {
    const { status, limit = 20, offset = 0 } = query;
    const filter = status ? { status } : {};
    return this.tournamentModel.find(filter).skip(offset).limit(limit).sort({ startDate: -1 }).populate('organizer teams.team').exec();
  }

  async findOne(id: string): Promise<Tournament> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Tournament ID');
    const tournament = await this.tournamentModel.findById(id).populate('organizer teams.team').exec();
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async update(id: string, data: Partial<Tournament>): Promise<Tournament> {
    const tournament = await this.tournamentModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async registerTeam(tournamentId: string, teamId: string): Promise<Tournament> {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const teamObjectId = new Types.ObjectId(teamId);
    if (tournament.teams.some(t => t.team.equals(teamObjectId))) {
       return tournament;
    }

    tournament.teams.push({
      team: teamObjectId,
      group: 'A',
      registrationDate: new Date(),
      seedNumber: tournament.teams.length + 1,
      status: 'REGISTERED' as any,
    });

    tournament.pointsTable.push({
      team: teamObjectId,
      group: 'A',
      played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, netRunRate: 0,
      runsScored: 0, ballsFaced: 0, runsConceded: 0, ballsBowled: 0, position: tournament.teams.length
    });

    return tournament.save();
  }

  async updatePointsTable(tournamentId: string, matchResult: {
    teamA: string;
    teamB: string;
    teamARuns: number;
    teamBRuns: number;
    teamABalls: number;
    teamBBalls: number;
    teamAAllOut: boolean;
    teamBAllOut: boolean;
    winner?: string;
    isTie?: boolean;
    isNoResult?: boolean;
  }) {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const totalMatchOvers = tournament.totalOvers || 20;

    const updateTeam = (teamId: string, runsScored: number, ballsFaced: number, runsConceded: number, ballsBowled: number, wasAllOut: boolean, opponentWasAllOut: boolean, isWin: boolean, isLoss: boolean, isTie: boolean, isNoResult: boolean) => {
      const entry = tournament.pointsTable.find(t => t.team.toString() === teamId);
      if (!entry) return;

      entry.played += 1;
      if (isWin) {
        entry.won += 1;
        entry.points += tournament.pointSystem.win;
      } else if (isLoss) {
        entry.lost += 1;
        entry.points += tournament.pointSystem.loss;
      } else if (isTie) {
        entry.tied += 1;
        entry.points += tournament.pointSystem.tie;
      } else if (isNoResult) {
        entry.noResult += 1;
        entry.points += tournament.pointSystem.noResult;
      }

      entry.runsScored += runsScored;
      // Handle NRR Special Case: If all out, use full allocated overs
      entry.ballsFaced += wasAllOut ? (totalMatchOvers * 6) : ballsFaced;

      entry.runsConceded += runsConceded;
      entry.ballsBowled += opponentWasAllOut ? (totalMatchOvers * 6) : ballsBowled;

      const scoringRate = entry.runsScored / (entry.ballsFaced / 6 || 0.1);
      const concedingRate = entry.runsConceded / (entry.ballsBowled / 6 || 0.1);
      entry.netRunRate = parseFloat((scoringRate - concedingRate).toFixed(3));
    };

    updateTeam(matchResult.teamA, matchResult.teamARuns, matchResult.teamABalls, matchResult.teamBRuns, matchResult.teamBBalls, matchResult.teamAAllOut, matchResult.teamBAllOut, matchResult.winner === matchResult.teamA, matchResult.winner === matchResult.teamB, !!matchResult.isTie, !!matchResult.isNoResult);
    updateTeam(matchResult.teamB, matchResult.teamBRuns, matchResult.teamBBalls, matchResult.teamARuns, matchResult.teamABalls, matchResult.teamBAllOut, matchResult.teamAAllOut, matchResult.winner === matchResult.teamB, matchResult.winner === matchResult.teamA, !!matchResult.isTie, !!matchResult.isNoResult);

    tournament.pointsTable.sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate);
    tournament.pointsTable.forEach((t, index) => t.position = index + 1);

    return tournament.save();
  }

  async generateSchedule(id: string) {
    const tournament = await this.tournamentModel.findById(id);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const teams = tournament.teams.map(t => t.team);
    if (teams.length < 2) throw new BadRequestException('Not enough teams to generate schedule');

    const schedule = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        schedule.push({
          matchNumber: schedule.length + 1,
          teamA: teams[i],
          teamB: teams[j],
          round: 'League',
          date: new Date(tournament.startDate.getTime() + (schedule.length * 24 * 60 * 60 * 1000)),
          venue: tournament.venue?.name || 'TBD'
        });
      }
    }
    tournament.schedule = schedule as any;
    tournament.status = TournamentStatus.UPCOMING;
    return tournament.save();
  }

  async getPointsTable(id: string) {
    const tournament = await this.findOne(id);
    return tournament.pointsTable.sort((a, b) => a.position - b.position);
  }

  async getSchedule(id: string) {
    const tournament = await this.findOne(id);
    return tournament.schedule;
  }
}

class BadRequestException extends Error {
  constructor(msg: string) { super(msg); }
}
