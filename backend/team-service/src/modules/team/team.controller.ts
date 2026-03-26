import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern('teams.create')
  async create(@Payload() data: any) { return this.teamService.create(data); }

  @MessagePattern('teams.findAll')
  async findAll(@Payload() query: any) { return this.teamService.findAll(query); }

  @MessagePattern('teams.search')
  async search(@Payload() data: any) { return this.teamService.search(data.q); }

  @MessagePattern('teams.findMyTeams')
  async findMyTeams(@Payload() data: any) { return this.teamService.findMyTeams(data.userId); }

  @MessagePattern('teams.findOne')
  async findOne(@Payload() data: any) { return this.teamService.findOne(data.id); }

  @MessagePattern('teams.update')
  async update(@Payload() data: any) { return this.teamService.update(data.id, data); }

  @MessagePattern('teams.remove')
  async remove(@Payload() data: any) { return this.teamService.remove(data.id); }

  @MessagePattern('teams.addMember')
  async addMember(@Payload() data: any) { return this.teamService.addMember(data.id, data); }

  @MessagePattern('teams.removeMember')
  async removeMember(@Payload() data: any) { return this.teamService.removeMember(data.id, data.userId); }

  @MessagePattern('teams.updateMemberRole')
  async updateMemberRole(@Payload() data: any) { return {}; }

  @MessagePattern('teams.getMembers')
  async getMembers(@Payload() data: any) { return []; }

  @MessagePattern('teams.getStats')
  async getStats(@Payload() data: any) { return {}; }

  @MessagePattern('teams.getMatches')
  async getMatches(@Payload() data: any) { return []; }

  @MessagePattern('teams.invite')
  async invite(@Payload() data: any) { return this.teamService.invite(data.id, data); }

  @MessagePattern('teams.join')
  async join(@Payload() data: any) { return this.teamService.join(data.id, data.inviteCode); }

  @MessagePattern('teams.getInvites')
  async getInvites(@Payload() data: any) { return []; }

  @MessagePattern('teams.respondInvite')
  async respondInvite(@Payload() data: any) { return {}; }

  @MessagePattern('teams.setCaptain')
  async setCaptain(@Payload() data: any) { return {}; }

  @MessagePattern('teams.setViceCaptain')
  async setViceCaptain(@Payload() data: any) { return {}; }

  @MessagePattern('teams.setWicketKeeper')
  async setWicketKeeper(@Payload() data: any) { return {}; }

  @MessagePattern('teams.uploadLogo')
  async uploadLogo(@Payload() data: any) { return {}; }
}
