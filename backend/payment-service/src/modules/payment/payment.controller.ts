import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payments.createOrder')
  async createOrder(@Payload() data: any) { return this.paymentService.createOrder(data.userId, data); }

  @MessagePattern('payments.verify')
  async verifyPayment(@Payload() data: any) { return this.paymentService.verifyPayment(data); }

  @MessagePattern('payments.history')
  async getHistory(@Payload() data: any) { return this.paymentService.getHistory(data.userId); }

  @MessagePattern('subscriptions.plans')
  async getPlans() { return this.paymentService.getPlans(); }

  @MessagePattern('subscriptions.subscribe')
  async subscribe(@Payload() data: any) { return this.paymentService.subscribe(data.userId, data); }

  @MessagePattern('subscriptions.my')
  async getMySubscription(@Payload() data: any) { return this.paymentService.getMySubscription(data.userId); }
}
