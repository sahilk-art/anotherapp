import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('media.uploadImage')
  async uploadImage(@Payload() data: any) { return this.mediaService.uploadImage(data); }

  @MessagePattern('media.uploadVideo')
  async uploadVideo(@Payload() data: any) { return this.mediaService.uploadVideo(data); }

  @MessagePattern('media.remove')
  async remove(@Payload() data: any) { return this.mediaService.remove(data.id); }

  @MessagePattern('media.uploadAvatar')
  async uploadAvatar(@Payload() data: any) { return this.mediaService.uploadImage(data); }

  @MessagePattern('media.uploadTeamLogo')
  async uploadTeamLogo(@Payload() data: any) { return this.mediaService.uploadImage(data); }
}
