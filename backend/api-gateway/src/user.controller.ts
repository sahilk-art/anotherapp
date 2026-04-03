import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  @Get()
  findAll(@Query() query: any) { return this.userClient.send('users.findAll', query); }

  @Get('search')
  search(@Query('q') q: string) { return this.userClient.send('users.search', { q }); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.userClient.send('users.findOne', { id }); }

  @Get(':id/stats')
  getStats(@Param('id') id: string) { return this.userClient.send('users.getStats', { id }); }

  @Get(':id/batting-stats')
  getBattingStats(@Param('id') id: string) { return this.userClient.send('users.getBattingStats', { id }); }

  @Get(':id/bowling-stats')
  getBowlingStats(@Param('id') id: string) { return this.userClient.send('users.getBowlingStats', { id }); }

  @Put('profile')
  updateProfile(@Body() data: any) { return this.userClient.send('users.updateProfile', data); }

  @Post('register-as-scorer')
  registerScorer(@Body() data: any) { return this.userClient.send('users.registerScorer', data); }

  @Post('register-as-umpire')
  registerUmpire(@Body() data: any) { return this.userClient.send('users.registerUmpire', data); }

  @Get('scorers/nearby')
  findNearbyScorers(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.userClient.send('users.findNearbyScorers', { lat, lng });
  }

  @Post(':id/follow')
  follow(@Param('id') id: string, @Body('userId') userId: string) { return this.userClient.send('users.follow', { id, userId }); }

  @Delete(':id/unfollow')
  unfollow(@Param('id') id: string, @Body('userId') userId: string) { return this.userClient.send('users.unfollow', { id, userId }); }
}
