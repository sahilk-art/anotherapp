import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from '../../../../shared/enums';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender?: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object })
  data: {
    matchId?: Types.ObjectId;
    teamId?: Types.ObjectId;
    tournamentId?: Types.ObjectId;
    postId?: Types.ObjectId;
    userId?: Types.ObjectId;
    actionUrl?: string;
  };

  @Prop()
  image?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isSent: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ required: true, index: { expires: '90d' }, default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ recipient: 1, createdAt: -1 });
