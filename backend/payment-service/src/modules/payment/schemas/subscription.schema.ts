import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubscriptionPlan, BillingCycle } from '../../../shared/enums';

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: String, enum: SubscriptionPlan, required: true })
  plan: SubscriptionPlan;

  @Prop({ type: Object })
  features: {
    liveStreaming: boolean;
    advancedAnalytics: boolean;
    noAds: boolean;
    prioritySupport: boolean;
    customScorecard: boolean;
    unlimitedTeams: boolean;
    exportData: boolean;
  };

  @Prop() amount: number;
  @Prop({ type: String, enum: BillingCycle })
  billingCycle: BillingCycle;

  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ default: true }) autoRenew: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Payment' }) paymentId: Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
