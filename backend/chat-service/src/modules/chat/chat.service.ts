import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private convModel: Model<Conversation>,
    @InjectModel(Message.name) private msgModel: Model<Message>,
  ) {}

  async getConversations(userId: string) {
    return this.convModel.find({ participants: userId }).sort({ updatedAt: -1 }).exec();
  }

  async getMessages(convId: string) {
    return this.msgModel.find({ conversation: convId }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async sendMessage(userId: string, data: any) {
    const message = new this.msgModel({ sender: userId, ...data });
    await message.save();
    await this.convModel.findByIdAndUpdate(data.conversation, {
      lastMessage: { content: data.content, sender: userId, timestamp: new Date() },
    });
    return message;
  }
}
