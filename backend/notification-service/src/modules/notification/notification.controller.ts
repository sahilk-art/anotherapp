import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  @MessagePattern('notifications.findAll')
  async findAll(@Payload() data: any) { return []; }

  @MessagePattern('notifications.getUnreadCount')
  async getUnreadCount(@Payload() data: any) { return { count: 0 }; }

  @MessagePattern('notifications.markAsRead')
  async markAsRead(@Payload() data: any) { return { success: true }; }

  @MessagePattern('notifications.markAllAsRead')
  async markAllAsRead(@Payload() data: any) { return { success: true }; }

  @MessagePattern('notifications.remove')
  async remove(@Payload() data: any) { return { success: true }; }

  @MessagePattern('notifications.updateSettings')
  async updateSettings(@Payload() data: any) { return { success: true }; }
}
