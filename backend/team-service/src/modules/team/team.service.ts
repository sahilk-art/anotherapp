import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team } from './schemas/team.schema';
import { TeamInvite } from './schemas/team-invite.schema';
import { ClientProxy } from '@nestjs/microservices';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(TeamInvite.name) private inviteModel: Model<TeamInvite>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  async create(data: Partial<Team>): Promise<Team> {
    const createdTeam = new this.teamModel({
      ...data,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
    return createdTeam.save();
  }

  async findAll(query: { limit?: number; offset?: number }): Promise<Team[]> {
    const { limit = 20, offset = 0 } = query;
    return this.teamModel.find().skip(offset).limit(limit).sort({ createdAt: -1 }).exec();
  }

  async search(q: string): Promise<Team[]> {
    if (!q) return [];
    return this.teamModel.find({ name: { $regex: q, $options: 'i' } }).limit(20).exec();
  }

  async findMyTeams(userId: string): Promise<Team[]> {
    return this.teamModel.find({ 'members.player': new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string): Promise<Team> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Team ID');
    const team = await this.teamModel.findById(id).populate('members.player').exec();
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    const team = await this.teamModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.teamModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Team not found');
    return { success: true };
  }

  async addMember(id: string, data: { player: string; role?: string }): Promise<Team> {
    const team = await this.teamModel.findByIdAndUpdate(
      id,
      { $addToSet: { members: { player: new Types.ObjectId(data.player), role: data.role || 'PLAYER' } } },
      { new: true }
    ).exec();
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async removeMember(id: string, userId: string): Promise<Team> {
    const team = await this.teamModel.findByIdAndUpdate(
      id,
      { $pull: { members: { player: new Types.ObjectId(userId) } } },
      { new: true }
    ).exec();
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async importPlayers(teamId: string, csvBuffer: Buffer): Promise<any> {
    const team = await this.teamModel.findById(teamId).exec();
    if (!team) throw new NotFoundException('Team not found');

    const results = { added: 0, invited: 0, failed: 0 };
    const players = [];

    const stream = Readable.from(csvBuffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => players.push(data))
        .on('end', async () => {
          for (const player of players) {
            try {
              if (player.Phone) {
                // Check if user exists (mocking user-service check)
                const exists = Math.random() > 0.5;
                if (exists) {
                   await this.addMember(teamId, { player: new Types.ObjectId().toHexString() });
                   results.added++;
                } else {
                   await this.invite(teamId, { phone: player.Phone, email: player.Email });
                   results.invited++;
                }
              } else {
                results.failed++;
              }
            } catch (e) {
              results.failed++;
            }
          }
          resolve(results);
        })
        .on('error', (error) => reject(error));
    });
  }

  async getImportTemplate(): Promise<string> {
    return 'Name,Phone,Email,BattingStyle,BowlingStyle,PlayerType\nJohn Doe,+919876543210,john@example.com,RIGHT_HAND,RIGHT_ARM_MEDIUM,BATSMAN';
  }

  async invite(id: string, data: Partial<TeamInvite>): Promise<TeamInvite> {
    const invite = new this.inviteModel({ team: new Types.ObjectId(id), ...data });
    return invite.save();
  }

  async join(id: string, inviteCode: string): Promise<any> {
    const team = await this.teamModel.findOne({ _id: id, inviteCode }).exec();
    if (!team) throw new BadRequestException('Invalid invite code for this team');
    return { success: true, teamId: team._id, teamName: team.name };
  }

  async findByInviteCode(code: string): Promise<Team> {
    const team = await this.teamModel.findOne({ inviteCode: code.toUpperCase() }).exec();
    if (!team) throw new NotFoundException('Team not found with this invite code');
    return team;
  }
}
