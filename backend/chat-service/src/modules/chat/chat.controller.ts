import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('chat.getConversations')
  async getConversations(@Payload() data: any) { return this.chatService.getConversations(data.userId); }

  @MessagePattern('chat.getMessages')
  async getMessages(@Payload() data: any) { return this.chatService.getMessages(data.conversationId); }

  @MessagePattern('chat.sendMessage')
  async sendMessage(@Payload() data: any) { return this.chatService.sendMessage(data.userId, data); }
}
