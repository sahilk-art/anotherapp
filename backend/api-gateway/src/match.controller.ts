import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchController {
  constructor(@Inject('MATCH_SERVICE') private readonly matchClient: ClientProxy, @Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy) {}

  @Get(':id/commentary')
  @ApiOperation({ summary: 'Get match commentary' })
  getCommentary(@Param('id') id: string) {
    return this.matchClient.send('matches.getCommentary', { id });
  }

  @Get(':id/highlights')
  @ApiOperation({ summary: 'Get match highlights' })
  getHighlights(@Param('id') id: string) {
    return this.analyticsClient.send('analytics.getHighlights', { matchId: id });
  }

  @Post()
  create(@Body() data: any) { return this.matchClient.send('matches.create', data); }

  @Get()
  findAll(@Query() query: any) { return this.matchClient.send('matches.findAll', query); }

  @Get('live')
  findLive() { return this.matchClient.send('matches.findLive', {}); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.matchClient.send('matches.findOne', { id }); }

  @Get(':id/export/pdf')
  exportPdf(@Param('id') id: string) { return this.matchClient.send('matches.exportPdf', { id }); }
}

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Get('app-status')
  getAppStatus() {
    return {
      maintenance: { isActive: false, message: "" },
      update: { forceUpdate: false, latestVersion: "1.0.0", minimumVersion: "1.0.0" },
      featureFlags: { liveStreaming: true, chat: true, payments: true }
    };
  }
}
