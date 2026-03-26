import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament } from './schemas/tournament.schema';

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
    return this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        { $push: { teams: { team: teamId, status: 'REGISTERED' } } },
        { new: true },
      )
      .exec();
  }

  async getPointsTable(id: string) {
    const tournament = await this.findOne(id);
    return tournament.pointsTable;
  }

  async getSchedule(id: string) {
    const tournament = await this.findOne(id);
    return tournament.schedule;
  }
}
