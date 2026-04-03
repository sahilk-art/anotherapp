import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Subscription } from './schemas/subscription.schema';
import { PaymentStatus, PaymentGateway } from '../../../../../shared/enums';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    private configService: ConfigService,
  ) {}

  async createOrder(userId: string, data: { amount: number; currency: string; planId: string }): Promise<Payment> {
    const gatewayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const payment = new this.paymentModel({
      user: new Types.ObjectId(userId),
      amount: data.amount,
      currency: data.currency,
      plan: data.planId,
      gateway: PaymentGateway.RAZORPAY,
      gatewayOrderId,
      status: PaymentStatus.CREATED,
    });

    return payment.save();
  }

  async verifyPayment(data: { gatewayOrderId: string; gatewayPaymentId: string; gatewaySignature: string }): Promise<Payment> {
    const { gatewayOrderId, gatewayPaymentId, gatewaySignature } = data;

    const payment = await this.paymentModel.findOne({ gatewayOrderId }).exec();
    if (!payment) throw new BadRequestException('Payment order not found');

    // Simulate Razorpay/Stripe signature verification
    // In production: const body = gatewayOrderId + '|' + gatewayPaymentId;
    // const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    const secret = this.configService.get<string>('PAYMENT_GATEWAY_SECRET') || 'mock_secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(gatewayOrderId + '|' + gatewayPaymentId);
    const expectedSignature = hmac.digest('hex');

    // For mock purposes, we accept any signature starting with 'mock_' or matching the HMAC
    const isValid = gatewaySignature === expectedSignature || gatewaySignature.startsWith('mock_');

    if (!isValid) {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
      throw new BadRequestException('Invalid payment signature');
    }

    payment.status = PaymentStatus.CAPTURED;
    payment.gatewayPaymentId = gatewayPaymentId;
    payment.gatewaySignature = gatewaySignature;
    payment.capturedAt = new Date();

    const updatedPayment = await payment.save();

    // Auto-subscribe if it's a plan payment
    if (updatedPayment.plan) {
      await this.subscribe(payment.user.toString(), { plan: updatedPayment.plan.toString() });
    }

    return updatedPayment;
  }

  async getHistory(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ user: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async getPlans(): Promise<any[]> {
    return [
      { id: 'pro_monthly', name: 'PRO', price: 499, currency: 'INR', duration: '30d', features: ['Advanced Stats', 'No Ads', 'Highlights'] },
      { id: 'premium_annual', name: 'PREMIUM', price: 4999, currency: 'INR', duration: '365d', features: ['Live Streaming', 'HD Reports', 'Priority Support'] }
    ];
  }

  async subscribe(userId: string, data: { plan: string }): Promise<Subscription> {
    // Deactivate existing subscriptions
    await this.subscriptionModel.updateMany({ user: new Types.ObjectId(userId), isActive: true }, { isActive: false });

    const durationDays = data.plan.includes('annual') ? 365 : 30;

    const subscription = new this.subscriptionModel({
      user: new Types.ObjectId(userId),
      plan: data.plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    return subscription.save();
  }

  async getMySubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionModel.findOne({ user: new Types.ObjectId(userId), isActive: true }).exec();
  }
}
