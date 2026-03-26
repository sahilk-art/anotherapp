import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notifications.findAll')
  async findAll(@Payload() data: any) {
    return this.notificationService.findAll(data.userId);
  }

  @MessagePattern('notifications.markAsRead')
  async markAsRead(@Payload() data: any) {
    return this.notificationService.markAsRead(data.id);
  }

  @EventPattern('send_notification')
  async handleSendNotification(@Payload() data: any) {
    return this.notificationService.sendPushNotification(data);
  }
}
