import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LiveStream extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Match' })
  match: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  streamer: Types.ObjectId;

  @Prop()
  title: string;

  @Prop({ unique: true, required: true })
  streamKey: string;

  @Prop()
  rtmpUrl: string;

  @Prop()
  hlsUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop({ default: 'CREATED' })
  status: string;

  @Prop({ default: 0 })
  viewerCount: number;

  @Prop({ default: 0 })
  peakViewerCount: number;

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;

  @Prop()
  duration: number;

  @Prop({ default: '720p' })
  quality: string;

  @Prop({ default: true })
  isRecording: boolean;

  @Prop()
  recordingUrl: string;

  @Prop({ default: true })
  chatEnabled: boolean;
}

export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);
