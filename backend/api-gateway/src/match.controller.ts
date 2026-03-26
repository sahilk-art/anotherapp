import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchController {
  constructor(@Inject('MATCH_SERVICE') private readonly matchClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create match' })
  create(@Body() data: any) {
    return this.matchClient.send('matches.create', data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  findAll(@Query() query: any) {
    return this.matchClient.send('matches.findAll', query);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get live matches' })
  findLive() {
    return this.matchClient.send('matches.findLive', {});
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent matches' })
  findRecent() {
    return this.matchClient.send('matches.findRecent', {});
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming matches' })
  findUpcoming() {
    return this.matchClient.send('matches.findUpcoming', {});
  }

  @Get('search')
  @ApiOperation({ summary: 'Search matches' })
  search(@Query('q') q: string) {
    return this.matchClient.send('matches.search', { q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match details' })
  findOne(@Param('id') id: string) {
    return this.matchClient.send('matches.findOne', { id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update match' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.matchClient.send('matches.update', { id, ...data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete match' })
  remove(@Param('id') id: string) {
    return this.matchClient.send('matches.remove', { id });
  }

  @Get(':id/scorecard')
  @ApiOperation({ summary: 'Get full scorecard' })
  getScorecard(@Param('id') id: string) {
    return this.matchClient.send('matches.getScorecard', { id });
  }

  @Get(':id/scorecard/innings/:num')
  @ApiOperation({ summary: 'Get innings-wise scorecard' })
  getInningsScorecard(@Param('id') id: string, @Param('num') num: string) {
    return this.matchClient.send('matches.getInningsScorecard', { id, num });
  }

  @Get(':id/overs')
  @ApiOperation({ summary: 'Get over-by-over data' })
  getOvers(@Param('id') id: string) {
    return this.matchClient.send('matches.getOvers', { id });
  }

  @Get(':id/overs/:overNum')
  @ApiOperation({ summary: 'Get specific over details' })
  getOverDetails(@Param('id') id: string, @Param('overNum') overNum: string) {
    return this.matchClient.send('matches.getOverDetails', { id, overNum });
  }

  @Get(':id/partnerships')
  @ApiOperation({ summary: 'Get partnerships data' })
  getPartnerships(@Param('id') id: string) {
    return this.matchClient.send('matches.getPartnerships', { id });
  }

  @Get(':id/fall-of-wickets')
  @ApiOperation({ summary: 'Get fall of wickets' })
  getFallOfWickets(@Param('id') id: string) {
    return this.matchClient.send('matches.getFallOfWickets', { id });
  }

  @Get(':id/commentary')
  @ApiOperation({ summary: 'Get ball-by-ball commentary' })
  getCommentary(@Param('id') id: string) {
    return this.matchClient.send('matches.getCommentary', { id });
  }

  @Get(':id/highlights')
  @ApiOperation({ summary: 'Get match highlights' })
  getHighlights(@Param('id') id: string) {
    return this.matchClient.send('matches.getHighlights', { id });
  }

  @Post(':id/toss')
  @ApiOperation({ summary: 'Set toss result' })
  setToss(@Param('id') id: string, @Body() data: any) {
    return this.matchClient.send('matches.setToss', { id, ...data });
  }

  @Post(':id/playing-xi')
  @ApiOperation({ summary: 'Set playing XI' })
  setPlayingXI(@Param('id') id: string, @Body() data: any) {
    return this.matchClient.send('matches.setPlayingXI', { id, ...data });
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update match status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.matchClient.send('matches.updateStatus', { id, status });
  }

  @Post(':id/result')
  @ApiOperation({ summary: 'Set match result' })
  setResult(@Param('id') id: string, @Body() data: any) {
    return this.matchClient.send('matches.setResult', { id, ...data });
  }

  @Get(':id/share')
  @ApiOperation({ summary: 'Get shareable match link' })
  getShareLink(@Param('id') id: string) {
    return this.matchClient.send('matches.getShareLink', { id });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby live matches' })
  getNearby(@Query() query: any) {
    return this.matchClient.send('matches.getNearby', query);
  }
}
