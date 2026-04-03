import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Subscription } from './schemas/subscription.schema';
import { PaymentStatus, PaymentGateway } from '../../../shared/enums';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
  ) {}

  async createOrder(userId: string, data: any) {
    const payment = new this.paymentModel({
      user: userId,
      ...data,
      status: PaymentStatus.CREATED,
    });
    return payment.save();
  }

  async verifyPayment(data: any) {
    // In real app, verify signature with Razorpay/Stripe SDK
    return this.paymentModel.findOneAndUpdate(
      { gatewayOrderId: data.gatewayOrderId },
      { status: PaymentStatus.CAPTURED, gatewayPaymentId: data.gatewayPaymentId, gatewaySignature: data.gatewaySignature },
      { new: true }
    );
  }

  async getHistory(userId: string) {
    return this.paymentModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async getPlans() {
    return [
      { plan: 'FREE', price: 0, features: ['Basic Scoring'] },
      { plan: 'PRO', price: 499, features: ['Advanced Stats', 'No Ads'] },
      { plan: 'PREMIUM', price: 999, features: ['Live Streaming', 'Reports'] }
    ];
  }

  async subscribe(userId: string, data: any) {
    const subscription = new this.subscriptionModel({
      user: userId,
      plan: data.plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    });
    return subscription.save();
  }

  async getMySubscription(userId: string) {
    return this.subscriptionModel.findOne({ user: userId, isActive: true }).exec();
  }
}
