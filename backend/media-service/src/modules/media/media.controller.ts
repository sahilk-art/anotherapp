import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MediaController {
  @MessagePattern('media.uploadImage')
  async uploadImage(@Payload() data: any) { return { url: 'http://example.com/image.jpg' }; }

  @MessagePattern('media.uploadVideo')
  async uploadVideo(@Payload() data: any) { return { url: 'http://example.com/video.mp4' }; }

  @MessagePattern('media.uploadMultiple')
  async uploadMultiple(@Payload() data: any) { return []; }

  @MessagePattern('media.remove')
  async remove(@Payload() data: any) { return { success: true }; }

  @MessagePattern('media.findOne')
  async findOne(@Payload() data: any) { return {}; }

  @MessagePattern('media.uploadAvatar')
  async uploadAvatar(@Payload() data: any) { return { url: 'http://example.com/avatar.jpg' }; }

  @MessagePattern('media.uploadTeamLogo')
  async uploadTeamLogo(@Payload() data: any) { return { url: 'http://example.com/logo.png' }; }
}
