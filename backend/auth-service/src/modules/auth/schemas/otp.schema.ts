import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OTPType } from '../../../../shared/enums';

@Schema({ timestamps: true })
export class OTP extends Document {
  @Prop({ required: true, index: true })
  phone: string;

  @Prop({ index: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ type: String, enum: OTPType, required: true })
  type: OTPType;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ required: true, index: { expires: '5m' } })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
