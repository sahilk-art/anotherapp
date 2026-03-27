import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Streaming')
@Controller('streaming')
export class StreamingController {
  constructor(@Inject('STREAMING_SERVICE') private readonly streamingClient: ClientProxy) {}

  @Post(':matchId/create')
  create(@Param('matchId') matchId: string, @Body('userId') userId: string) {
    return this.streamingClient.send('streaming.create', { matchId, userId });
  }

  @Post(':matchId/start')
  start(@Param('matchId') matchId: string) {
    return this.streamingClient.send('streaming.start', { matchId });
  }

  @Post(':matchId/end')
  end(@Param('matchId') matchId: string) {
    return this.streamingClient.send('streaming.end', { matchId });
  }

  @Get(':matchId')
  findOne(@Param('matchId') matchId: string) {
    return this.streamingClient.send('streaming.findOne', { matchId });
  }

  @Get('live')
  findLive() {
    return this.streamingClient.send('streaming.findLive', {});
  }
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(@Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy) {}

  @Get('conversations')
  getConversations(@Query('userId') userId: string) {
    return this.chatClient.send('chat.getConversations', { userId });
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatClient.send('chat.getMessages', { conversationId: id });
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() data: any) {
    return this.chatClient.send('chat.sendMessage', { conversation: id, ...data });
  }
}
