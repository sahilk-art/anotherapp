import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DeviceType } from '../../../../shared/enums';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class RefreshToken extends Document {
  @Prop({ type: Types.ObjectId, required: true, index: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Object })
  deviceInfo: {
    deviceId: string;
    deviceType: DeviceType;
    deviceName: string;
    os: string;
    appVersion: string;
  };

  @Prop()
  ipAddress: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true, index: { expires: '30d' } })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
