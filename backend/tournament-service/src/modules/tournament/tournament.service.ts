import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament } from './schemas/tournament.schema';
import { RoundType, TournamentStatus } from '../../../../../shared/enums';

@Injectable()
export class TournamentService {
  constructor(@InjectModel(Tournament.name) private tournamentModel: Model<Tournament>) {}

  async create(data: any): Promise<Tournament> {
    const createdTournament = new this.tournamentModel(data);
    return createdTournament.save();
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentModel.find().populate('organizer teams.team').exec();
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentModel.findById(id).populate('organizer teams.team').exec();
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async update(id: string, data: any): Promise<Tournament> {
    return this.tournamentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async registerTeam(tournamentId: string, teamId: string): Promise<Tournament> {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    tournament.teams.push({
      team: new Types.ObjectId(teamId),
      group: 'A',
      registrationDate: new Date(),
      seedNumber: tournament.teams.length + 1,
      status: 'REGISTERED' as any,
    });

    // Also add to points table
    tournament.pointsTable.push({
      team: new Types.ObjectId(teamId),
      group: 'A',
      played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, netRunRate: 0,
      runsScored: 0, oversFaced: 0, runsConceded: 0, oversBowled: 0, position: tournament.teams.length
    });

    return tournament.save();
  }

  async generateSchedule(id: string) {
    const tournament = await this.tournamentModel.findById(id);
    const teams = tournament.teams.map(t => t.team);
    const schedule = [];

    // Simple round-robin schedule generation
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        schedule.push({
          matchNumber: schedule.length + 1,
          teamA: teams[i],
          teamB: teams[j],
          round: 'League',
          date: new Date(),
          venue: tournament.venue.name
        });
      }
    }
    tournament.schedule = schedule as any;
    tournament.status = TournamentStatus.UPCOMING;
    return tournament.save();
  }

  async getPointsTable(id: string) {
    const tournament = await this.findOne(id);
    return tournament.pointsTable.sort((a, b) => b.points - a.points || b.netRunRate - a.netRunRate);
  }

  async getSchedule(id: string) {
    const tournament = await this.findOne(id);
    return tournament.schedule;
  }
}
