import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tournaments')
@ApiBearerAuth()
@Controller('tournaments')
export class TournamentController {
  constructor(@Inject('TOURNAMENT_SERVICE') private readonly tournamentClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create tournament' })
  create(@Body() data: any) {
    return this.tournamentClient.send('tournaments.create', data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tournaments' })
  findAll(@Query() query: any) {
    return this.tournamentClient.send('tournaments.findAll', query);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get ongoing tournaments' })
  findLive() {
    return this.tournamentClient.send('tournaments.findLive', {});
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tournaments' })
  findUpcoming() {
    return this.tournamentClient.send('tournaments.findUpcoming', {});
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get completed tournaments' })
  findCompleted() {
    return this.tournamentClient.send('tournaments.findCompleted', {});
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tournaments' })
  search(@Query('q') q: string) {
    return this.tournamentClient.send('tournaments.search', { q });
  }

  @Get('my-tournaments')
  @ApiOperation({ summary: "Get user's tournaments" })
  findMyTournaments(@Body('userId') userId: string) {
    return this.tournamentClient.send('tournaments.findMyTournaments', { userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tournament details' })
  findOne(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.findOne', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tournament' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.tournamentClient.send('tournaments.update', { id, ...data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tournament' })
  remove(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.remove', { id });
  }

  @Post(':id/teams/register')
  @ApiOperation({ summary: 'Register team in tournament' })
  registerTeam(@Param('id') id: string, @Body('teamId') teamId: string) {
    return this.tournamentClient.send('tournaments.registerTeam', { id, teamId });
  }

  @Delete(':id/teams/:teamId')
  @ApiOperation({ summary: 'Remove team from tournament' })
  removeTeam(@Param('id') id: string, @Param('teamId') teamId: string) {
    return this.tournamentClient.send('tournaments.removeTeam', { id, teamId });
  }

  @Get(':id/teams')
  @ApiOperation({ summary: 'Get registered teams' })
  getTeams(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getTeams', { id });
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get tournament matches' })
  getMatches(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getMatches', { id });
  }

  @Get(':id/points-table')
  @ApiOperation({ summary: 'Get points table' })
  getPointsTable(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getPointsTable', { id });
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get tournament schedule' })
  getSchedule(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getSchedule', { id });
  }

  @Post(':id/schedule/generate')
  @ApiOperation({ summary: 'Auto-generate schedule' })
  generateSchedule(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.generateSchedule', { id });
  }

  @Put(':id/schedule')
  @ApiOperation({ summary: 'Update schedule' })
  updateSchedule(@Param('id') id: string, @Body() data: any) {
    return this.tournamentClient.send('tournaments.updateSchedule', { id, ...data });
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get tournament leaderboard' })
  getLeaderboard(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getLeaderboard', { id });
  }

  @Get(':id/leaderboard/batting')
  @ApiOperation({ summary: 'Batting leaderboard' })
  getBattingLeaderboard(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getBattingLeaderboard', { id });
  }

  @Get(':id/leaderboard/bowling')
  @ApiOperation({ summary: 'Bowling leaderboard' })
  getBowlingLeaderboard(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getBowlingLeaderboard', { id });
  }

  @Get(':id/leaderboard/fielding')
  @ApiOperation({ summary: 'Fielding leaderboard' })
  getFieldingLeaderboard(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getFieldingLeaderboard', { id });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get tournament stats' })
  getStats(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getStats', { id });
  }

  @Post(':id/groups')
  @ApiOperation({ summary: 'Create groups' })
  createGroups(@Param('id') id: string, @Body() data: any) {
    return this.tournamentClient.send('tournaments.createGroups', { id, ...data });
  }

  @Put(':id/groups')
  @ApiOperation({ summary: 'Update groups' })
  updateGroups(@Param('id') id: string, @Body() data: any) {
    return this.tournamentClient.send('tournaments.updateGroups', { id, ...data });
  }

  @Get(':id/groups')
  @ApiOperation({ summary: 'Get groups' })
  getGroups(@Param('id') id: string) {
    return this.tournamentClient.send('tournaments.getGroups', { id });
  }

  @Post(':id/rounds')
  @ApiOperation({ summary: 'Add round/phase' })
  addRound(@Param('id') id: string, @Body() data: any) {
    return this.tournamentClient.send('tournaments.addRound', { id, ...data });
  }

  @Post(':id/admins')
  @ApiOperation({ summary: 'Add tournament admin' })
  addAdmin(@Param('id') id: string, @Body('userId') userId: string) {
    return this.tournamentClient.send('tournaments.addAdmin', { id, userId });
  }

  @Delete(':id/admins/:userId')
  @ApiOperation({ summary: 'Remove admin' })
  removeAdmin(@Param('id') id: string, @Param('userId') userId: string) {
    return this.tournamentClient.send('tournaments.removeAdmin', { id, userId });
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update tournament status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tournamentClient.send('tournaments.updateStatus', { id, status });
  }
}
