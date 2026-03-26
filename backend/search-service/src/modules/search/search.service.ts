import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class SearchService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  async universal(q: string, type: string) {
    if (type === 'players') return this.userModel.find({ fullName: new RegExp(q, 'i') }).limit(10).exec();
    // In a real app, search across other service collections via Gateway or shared DB
    return [];
  }
}
