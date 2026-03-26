import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InviteStatus } from '../../../../shared/enums';

@Schema({ timestamps: true })
export class TeamInvite extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Team' })
  team: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  invitedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  invitedUser?: Types.ObjectId;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: InviteStatus, default: InviteStatus.PENDING })
  status: InviteStatus;

  @Prop({ required: true })
  expiresAt: Date;
}

export const TeamInviteSchema = SchemaFactory.createForClass(TeamInvite);
