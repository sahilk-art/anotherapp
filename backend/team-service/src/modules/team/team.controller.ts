import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';
import { Team } from './schemas/team.schema';
import { TeamInvite } from './schemas/team-invite.schema';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern('teams.create')
  async create(@Payload() data: Partial<Team>): Promise<Team> {
    return this.teamService.create(data);
  }

  @MessagePattern('teams.findAll')
  async findAll(@Payload() query: { limit?: number; offset?: number }): Promise<Team[]> {
    return this.teamService.findAll(query);
  }

  @MessagePattern('teams.search')
  async search(@Payload() data: { q: string }): Promise<Team[]> {
    return this.teamService.search(data.q);
  }

  @MessagePattern('teams.findOne')
  async findOne(@Payload() data: { id: string }): Promise<Team> {
    return this.teamService.findOne(data.id);
  }

  @MessagePattern('teams.findMyTeams')
  async findMyTeams(@Payload() data: { userId: string }): Promise<Team[]> {
    return this.teamService.findMyTeams(data.userId);
  }

  @MessagePattern('teams.update')
  async update(@Payload() data: { id: string } & Partial<Team>): Promise<Team> {
    const { id, ...updateData } = data;
    return this.teamService.update(id, updateData);
  }

  @MessagePattern('teams.addMember')
  async addMember(@Payload() data: { id: string; player: string; role?: string }): Promise<Team> {
    return this.teamService.addMember(data.id, data);
  }

  @MessagePattern('teams.removeMember')
  async removeMember(@Payload() data: { id: string; userId: string }): Promise<Team> {
    return this.teamService.removeMember(data.id, data.userId);
  }

  @MessagePattern('teams.importPlayers')
  async importPlayers(@Payload() data: { id: string; players: any[] }): Promise<any> {
    return this.teamService.importPlayers(data.id, data.players);
  }

  @MessagePattern('teams.getImportTemplate')
  async getImportTemplate(): Promise<string> {
    return this.teamService.getImportTemplate();
  }

  @MessagePattern('teams.invite')
  async invite(@Payload() data: { id: string } & Partial<TeamInvite>): Promise<TeamInvite> {
    const { id, ...inviteData } = data;
    return this.teamService.invite(id, inviteData);
  }

  @MessagePattern('teams.join')
  async join(@Payload() data: { id: string; inviteCode: string }): Promise<any> {
    return this.teamService.join(data.id, data.inviteCode);
  }

  @MessagePattern('teams.findByInviteCode')
  async findByInviteCode(@Payload() data: { code: string }): Promise<Team> {
    return this.teamService.findByInviteCode(data.code);
  }
}
