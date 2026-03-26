import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy) {}

  @Get('match/:matchId/wagon-wheel')
  getWagonWheel(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getWagonWheel', { matchId });
  }

  @Get('match/:matchId/wagon-wheel/:playerId')
  getPlayerWagonWheel(@Param('matchId') matchId: string, @Param('playerId') playerId: string) {
    return this.analyticsClient.send('analytics.getPlayerWagonWheel', { matchId, playerId });
  }

  @Get('match/:matchId/manhattan')
  getManhattan(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getManhattan', { matchId });
  }

  @Get('match/:matchId/worm')
  getWorm(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getWorm', { matchId });
  }

  @Get('match/:matchId/run-rate')
  getRunRate(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getRunRate', { matchId });
  }

  @Get('match/:matchId/run-rate/required')
  getRequiredRunRate(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getRequiredRunRate', { matchId });
  }

  @Get('match/:matchId/partnerships')
  getPartnerships(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getPartnerships', { matchId });
  }

  @Get('match/:matchId/mvp')
  getMVP(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getMVP', { matchId });
  }

  @Get('match/:matchId/pitch-map')
  getPitchMap(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getPitchMap', { matchId });
  }

  @Get('match/:matchId/scoring-zones')
  getScoringZones(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getScoringZones', { matchId });
  }

  @Get('match/:matchId/over-comparison')
  getOverComparison(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getOverComparison', { matchId });
  }

  @Get('match/:matchId/boundary-tracker')
  getBoundaryTracker(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getBoundaryTracker', { matchId });
  }

  @Get('match/:matchId/powerplay-stats')
  getPowerplayStats(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getPowerplayStats', { matchId });
  }

  @Get('match/:matchId/death-overs-stats')
  getDeathOversStats(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getDeathOversStats', { matchId });
  }

  @Get('player/:playerId/form-graph')
  getPlayerFormGraph(@Param('playerId') playerId: string) {
    return this.analyticsClient.send('analytics.getPlayerFormGraph', { playerId });
  }

  @Get('player/:playerId/stats-comparison')
  getStatsComparison(@Param('playerId') playerId: string, @Query('compareWith') compareWith: string) {
    return this.analyticsClient.send('analytics.getStatsComparison', { playerId, compareWith });
  }

  @Get('team/:teamId/performance')
  getTeamPerformance(@Param('teamId') teamId: string) {
    return this.analyticsClient.send('analytics.getTeamPerformance', { teamId });
  }
}

@ApiTags('Feed')
@ApiBearerAuth()
@Controller('feed')
export class FeedController {
  constructor(@Inject('FEED_SERVICE') private readonly feedClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get feed' })
  findAll(@Query() query: any) {
    return this.feedClient.send('feed.findAll', query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending posts' })
  getTrending() {
    return this.feedClient.send('feed.getTrending', {});
  }

  @Post('posts')
  @ApiOperation({ summary: 'Create post' })
  createPost(@Body() data: any) {
    return this.feedClient.send('feed.createPost', data);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get post detail' })
  getPost(@Param('id') id: string) {
    return this.feedClient.send('feed.getPost', { id });
  }

  @Put('posts/:id')
  @ApiOperation({ summary: 'Update post' })
  updatePost(@Param('id') id: string, @Body() data: any) {
    return this.feedClient.send('feed.updatePost', { id, ...data });
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete post' })
  deletePost(@Param('id') id: string) {
    return this.feedClient.send('feed.deletePost', { id });
  }

  @Post('posts/:id/like')
  @ApiOperation({ summary: 'Like post' })
  likePost(@Param('id') id: string, @Body('userId') userId: string) {
    return this.feedClient.send('feed.likePost', { id, userId });
  }

  @Delete('posts/:id/unlike')
  @ApiOperation({ summary: 'Unlike post' })
  unlikePost(@Param('id') id: string, @Body('userId') userId: string) {
    return this.feedClient.send('feed.unlikePost', { id, userId });
  }

  @Get('posts/:id/likes')
  @ApiOperation({ summary: 'Get post likes' })
  getPostLikes(@Param('id') id: string) {
    return this.feedClient.send('feed.getPostLikes', { id });
  }

  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Add comment' })
  addComment(@Param('id') id: string, @Body() data: any) {
    return this.feedClient.send('feed.addComment', { id, ...data });
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: 'Get comments' })
  getComments(@Param('id') id: string) {
    return this.feedClient.send('feed.getComments', { id });
  }

  @Delete('posts/:id/comments/:cId')
  @ApiOperation({ summary: 'Delete comment' })
  deleteComment(@Param('id') id: string, @Param('cId') cId: string) {
    return this.feedClient.send('feed.deleteComment', { id, cId });
  }

  @Post('posts/:id/share')
  @ApiOperation({ summary: 'Share post' })
  sharePost(@Param('id') id: string, @Body() data: any) {
    return this.feedClient.send('feed.sharePost', { id, ...data });
  }

  @Post('polls')
  @ApiOperation({ summary: 'Create poll' })
  createPoll(@Body() data: any) {
    return this.feedClient.send('feed.createPoll', data);
  }

  @Post('polls/:id/vote')
  @ApiOperation({ summary: 'Vote on poll' })
  votePoll(@Param('id') id: string, @Body('optionIndex') optionIndex: number) {
    return this.feedClient.send('feed.votePoll', { id, optionIndex });
  }

  @Post('posts/:id/report')
  @ApiOperation({ summary: 'Report post' })
  reportPost(@Param('id') id: string, @Body() data: any) {
    return this.feedClient.send('feed.reportPost', { id, ...data });
  }
}

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(@Inject('LEADERBOARD_SERVICE') private readonly leaderboardClient: ClientProxy) {}

  @Get('global/batting')
  getGlobalBatting() { return this.leaderboardClient.send('leaderboard.getGlobal', { category: 'BATTING' }); }

  @Get('global/bowling')
  getGlobalBowling() { return this.leaderboardClient.send('leaderboard.getGlobal', { category: 'BOWLING' }); }

  @Get('global/fielding')
  getGlobalFielding() { return this.leaderboardClient.send('leaderboard.getGlobal', { category: 'FIELDING' }); }

  @Get('global/mvp')
  getGlobalMVP() { return this.leaderboardClient.send('leaderboard.getGlobal', { category: 'MVP' }); }

  @Get('monthly/batting')
  getMonthlyBatting() { return this.leaderboardClient.send('leaderboard.getMonthly', { category: 'BATTING' }); }

  @Get('monthly/bowling')
  getMonthlyBowling() { return this.leaderboardClient.send('leaderboard.getMonthly', { category: 'BOWLING' }); }

  @Get('weekly/batting')
  getWeeklyBatting() { return this.leaderboardClient.send('leaderboard.getWeekly', { category: 'BATTING' }); }

  @Get('weekly/bowling')
  getWeeklyBowling() { return this.leaderboardClient.send('leaderboard.getWeekly', { category: 'BOWLING' }); }

  @Get('local')
  getLocal(@Query('city') city: string, @Query('state') state: string) {
    return this.leaderboardClient.send('leaderboard.getLocal', { city, state });
  }

  @Get('tournament/:tournamentId/:category')
  getTournamentLeaderboard(@Param('tournamentId') tournamentId: string, @Param('category') category: string) {
    return this.leaderboardClient.send('leaderboard.getTournament', { tournamentId, category });
  }
}

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(@Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Universal search' })
  search(@Query('q') q: string, @Query('type') type: string) {
    return this.searchClient.send('search.universal', { q, type });
  }

  @Get('players')
  searchPlayers(@Query('q') q: string) { return this.searchClient.send('search.players', { q }); }

  @Get('teams')
  searchTeams(@Query('q') q: string) { return this.searchClient.send('search.teams', { q }); }

  @Get('tournaments')
  searchTournaments(@Query('q') q: string) { return this.searchClient.send('search.tournaments', { q }); }

  @Get('matches')
  searchMatches(@Query('q') q: string) { return this.searchClient.send('search.matches', { q }); }

  @Get('suggestions')
  getSuggestions(@Query('q') q: string) { return this.searchClient.send('search.suggestions', { q }); }

  @Get('recent')
  getRecent() { return this.searchClient.send('search.getRecent', {}); }

  @Delete('recent')
  clearRecent() { return this.searchClient.send('search.clearRecent', {}); }
}

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(@Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll(@Query('userId') userId: string) {
    return this.notificationClient.send('notifications.findAll', { userId });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  getUnreadCount(@Query('userId') userId: string) {
    return this.notificationClient.send('notifications.getUnreadCount', { userId });
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationClient.send('notifications.markAsRead', { id });
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  markAllAsRead(@Query('userId') userId: string) {
    return this.notificationClient.send('notifications.markAllAsRead', { userId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string) {
    return this.notificationClient.send('notifications.remove', { id });
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateSettings(@Body() data: any) {
    return this.notificationClient.send('notifications.updateSettings', data);
  }
}

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(@Inject('MEDIA_SERVICE') private readonly mediaClient: ClientProxy) {}

  @Post('upload/image')
  @ApiOperation({ summary: 'Upload image' })
  uploadImage(@Body() data: any) { return this.mediaClient.send('media.uploadImage', data); }

  @Post('upload/video')
  @ApiOperation({ summary: 'Upload video' })
  uploadVideo(@Body() data: any) { return this.mediaClient.send('media.uploadVideo', data); }

  @Post('upload/multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  uploadMultiple(@Body() data: any) { return this.mediaClient.send('media.uploadMultiple', data); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media' })
  remove(@Param('id') id: string) { return this.mediaClient.send('media.remove', { id }); }

  @Get(':id')
  @ApiOperation({ summary: 'Get media info' })
  findOne(@Param('id') id: string) { return this.mediaClient.send('media.findOne', { id }); }

  @Post('upload/avatar')
  @ApiOperation({ summary: 'Upload & resize avatar' })
  uploadAvatar(@Body() data: any) { return this.mediaClient.send('media.uploadAvatar', data); }

  @Post('upload/team-logo')
  @ApiOperation({ summary: 'Upload & resize team logo' })
  uploadTeamLogo(@Body() data: any) { return this.mediaClient.send('media.uploadTeamLogo', data); }
}
