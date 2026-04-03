import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentType, PaymentStatus, PaymentGateway } from '../../../../../shared/enums';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tournament' })
  tournament?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team?: Types.ObjectId;

  @Prop({ type: String, enum: PaymentType, required: true })
  type: PaymentType;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;

  @Prop({ type: String, enum: PaymentGateway })
  paymentGateway: PaymentGateway;

  @Prop() gatewayOrderId: string;
  @Prop() gatewayPaymentId: string;
  @Prop() gatewaySignature: string;
  @Prop() receiptUrl: string;
  @Prop() refundId: string;
  @Prop() refundAmount: number;
  @Prop({ type: Object }) metadata: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
