import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LiveStream } from './schemas/live-stream.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StreamingService {
  constructor(@InjectModel(LiveStream.name) private streamModel: Model<LiveStream>) {}

  async createStream(matchId: string, userId: string) {
    const streamKey = uuidv4();
    const stream = new this.streamModel({
      match: new Types.ObjectId(matchId),
      streamer: new Types.ObjectId(userId),
      streamKey,
      rtmpUrl: `rtmp://your-rtmp-server.com/live/${streamKey}`,
      hlsUrl: `https://your-cdn.com/live/${streamKey}/index.m3u8`,
      status: 'CREATED',
    });
    return stream.save();
  }

  async startStream(matchId: string) {
    return this.streamModel.findOneAndUpdate({ match: matchId }, { status: 'LIVE', startedAt: new Date() }, { new: true });
  }

  async endStream(matchId: string) {
    return this.streamModel.findOneAndUpdate({ match: matchId }, { status: 'ENDED', endedAt: new Date() }, { new: true });
  }

  async getStreamInfo(matchId: string) {
    return this.streamModel.findOne({ match: matchId }).exec();
  }

  async getLiveStreams() {
    return this.streamModel.find({ status: 'LIVE' }).exec();
  }
}
