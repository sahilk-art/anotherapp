import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchController {
  constructor(@Inject('MATCH_SERVICE') private readonly matchClient: ClientProxy) {}

  @Get(':id/og-preview')
  @ApiOperation({ summary: 'Get OG metadata for sharing' })
  getOgPreview(@Param('id') id: string) {
    return this.matchClient.send('matches.getOgMetadata', { id });
  }

  @Get(':id/og-image')
  @ApiOperation({ summary: 'Get OG image for sharing' })
  getOgImage(@Param('id') id: string) {
    return this.matchClient.send('matches.getOgImage', { id });
  }

  // ... other match endpoints ...
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
