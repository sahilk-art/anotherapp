import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(@Query() query: any) {
    return this.userClient.send('users.findAll', query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  search(@Query('q') q: string) {
    return this.userClient.send('users.search', { q });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile' })
  findOne(@Param('id') id: string) {
    return this.userClient.send('users.findOne', { id });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get player career stats' })
  getStats(@Param('id') id: string) {
    return this.userClient.send('users.getStats', { id });
  }

  @Get(':id/batting-stats')
  @ApiOperation({ summary: 'Detailed batting stats' })
  getBattingStats(@Param('id') id: string) {
    return this.userClient.send('users.getBattingStats', { id });
  }

  @Get(':id/bowling-stats')
  @ApiOperation({ summary: 'Detailed bowling stats' })
  getBowlingStats(@Param('id') id: string) {
    return this.userClient.send('users.getBowlingStats', { id });
  }

  @Get(':id/fielding-stats')
  @ApiOperation({ summary: 'Fielding stats' })
  getFieldingStats(@Param('id') id: string) {
    return this.userClient.send('users.getFieldingStats', { id });
  }

  @Get(':id/matches')
  @ApiOperation({ summary: "Get user's match history" })
  getMatches(@Param('id') id: string) {
    return this.userClient.send('users.getMatches', { id });
  }

  @Get(':id/teams')
  @ApiOperation({ summary: "Get user's teams" })
  getTeams(@Param('id') id: string) {
    return this.userClient.send('users.getTeams', { id });
  }

  @Get(':id/tournaments')
  @ApiOperation({ summary: "Get user's tournaments" })
  getTournaments(@Param('id') id: string) {
    return this.userClient.send('users.getTournaments', { id });
  }

  @Get(':id/achievements')
  @ApiOperation({ summary: "Get user's achievements" })
  getAchievements(@Param('id') id: string) {
    return this.userClient.send('users.getAchievements', { id });
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get followers list' })
  getFollowers(@Param('id') id: string) {
    return this.userClient.send('users.getFollowers', { id });
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get following list' })
  getFollowing(@Param('id') id: string) {
    return this.userClient.send('users.getFollowing', { id });
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(@Body() data: any) {
    return this.userClient.send('users.updateProfile', data);
  }

  @Put('avatar')
  @ApiOperation({ summary: 'Upload avatar' })
  updateAvatar(@Body() data: any) {
    return this.userClient.send('users.updateAvatar', data);
  }

  @Put('cover-photo')
  @ApiOperation({ summary: 'Upload cover photo' })
  updateCoverPhoto(@Body() data: any) {
    return this.userClient.send('users.updateCoverPhoto', data);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update settings' })
  updateSettings(@Body() data: any) {
    return this.userClient.send('users.updateSettings', data);
  }

  @Put('fcm-token')
  @ApiOperation({ summary: 'Update FCM token' })
  updateFcmToken(@Body() data: any) {
    return this.userClient.send('users.updateFcmToken', data);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow a user' })
  follow(@Param('id') id: string, @Body('userId') userId: string) {
    return this.userClient.send('users.follow', { id, userId });
  }

  @Delete(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@Param('id') id: string, @Body('userId') userId: string) {
    return this.userClient.send('users.unfollow', { id, userId });
  }

  @Get(':id/recent-form')
  @ApiOperation({ summary: 'Get last 10 match scores' })
  getRecentForm(@Param('id') id: string) {
    return this.userClient.send('users.getRecentForm', { id });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby players' })
  getNearby(@Query() query: any) {
    return this.userClient.send('users.getNearby', query);
  }
}
