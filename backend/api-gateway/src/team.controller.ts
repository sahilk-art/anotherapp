import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
  constructor(@Inject('TEAM_SERVICE') private readonly teamClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create team' })
  create(@Body() data: any) {
    return this.teamClient.send('teams.create', data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  findAll(@Query() query: any) {
    return this.teamClient.send('teams.findAll', query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search teams' })
  search(@Query('q') q: string) {
    return this.teamClient.send('teams.search', { q });
  }

  @Get('my-teams')
  @ApiOperation({ summary: "Get current user's teams" })
  findMyTeams(@Body('userId') userId: string) {
    return this.teamClient.send('teams.findMyTeams', { userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team details' })
  findOne(@Param('id') id: string) {
    return this.teamClient.send('teams.findOne', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.teamClient.send('teams.update', { id, ...data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete team' })
  remove(@Param('id') id: string) {
    return this.teamClient.send('teams.remove', { id });
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to team' })
  addMember(@Param('id') id: string, @Body() data: any) {
    return this.teamClient.send('teams.addMember', { id, ...data });
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamClient.send('teams.removeMember', { id, userId });
  }

  @Put(':id/members/:userId/role')
  @ApiOperation({ summary: 'Update member role' })
  updateMemberRole(@Param('id') id: string, @Param('userId') userId: string, @Body('role') role: string) {
    return this.teamClient.send('teams.updateMemberRole', { id, userId, role });
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get team members' })
  getMembers(@Param('id') id: string) {
    return this.teamClient.send('teams.getMembers', { id });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get team stats' })
  getStats(@Param('id') id: string) {
    return this.teamClient.send('teams.getStats', { id });
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get team match history' })
  getMatches(@Param('id') id: string) {
    return this.teamClient.send('teams.getMatches', { id });
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Send team invite' })
  invite(@Param('id') id: string, @Body() data: any) {
    return this.teamClient.send('teams.invite', { id, ...data });
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join team with invite code' })
  join(@Param('id') id: string, @Body('inviteCode') inviteCode: string) {
    return this.teamClient.send('teams.join', { id, inviteCode });
  }

  @Get(':id/invites')
  @ApiOperation({ summary: 'Get pending invites' })
  getInvites(@Param('id') id: string) {
    return this.teamClient.send('teams.getInvites', { id });
  }

  @Put('invites/:inviteId/respond')
  @ApiOperation({ summary: 'Accept/Reject invite' })
  respondInvite(@Param('inviteId') inviteId: string, @Body('status') status: string) {
    return this.teamClient.send('teams.respondInvite', { inviteId, status });
  }

  @Put(':id/captain')
  @ApiOperation({ summary: 'Set captain' })
  setCaptain(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamClient.send('teams.setCaptain', { id, userId });
  }

  @Put(':id/vice-captain')
  @ApiOperation({ summary: 'Set vice captain' })
  setViceCaptain(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamClient.send('teams.setViceCaptain', { id, userId });
  }

  @Put(':id/wicket-keeper')
  @ApiOperation({ summary: 'Set wicket keeper' })
  setWicketKeeper(@Param('id') id: string, @Body('userId') userId: string) {
    return this.teamClient.send('teams.setWicketKeeper', { id, userId });
  }

  @Post(':id/logo')
  @ApiOperation({ summary: 'Upload team logo' })
  uploadLogo(@Param('id') id: string, @Body() data: any) {
    return this.teamClient.send('teams.uploadLogo', { id, ...data });
  }
}
