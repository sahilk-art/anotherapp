import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './schemas/team.schema';
import { TeamInvite } from './schemas/team-invite.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(TeamInvite.name) private inviteModel: Model<TeamInvite>,
  ) {}

  async create(data: any): Promise<Team> {
    const createdTeam = new this.teamModel(data);
    return createdTeam.save();
  }

  async findAll(query: any): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async search(q: string): Promise<Team[]> {
    return this.teamModel.find({ name: new RegExp(q, 'i') }).exec();
  }

  async findMyTeams(userId: string): Promise<Team[]> {
    return this.teamModel.find({ owner: userId }).exec();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id).populate('members.player').exec();
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, data: any): Promise<Team> {
    return this.teamModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.teamModel.findByIdAndDelete(id).exec();
  }

  async addMember(id: string, data: any) {
    return this.teamModel.findByIdAndUpdate(id, { $push: { members: data } }, { new: true }).exec();
  }

  async removeMember(id: string, userId: string) {
    return this.teamModel.findByIdAndUpdate(id, { $pull: { members: { player: userId } } }, { new: true }).exec();
  }

  async invite(id: string, data: any) {
    const invite = new this.inviteModel({ team: id, ...data });
    return invite.save();
  }

  async join(id: string, inviteCode: string) {
    const team = await this.teamModel.findOne({ _id: id, inviteCode }).exec();
    if (!team) throw new NotFoundException('Invalid invite code');
    // Implementation
    return { success: true };
  }
}
