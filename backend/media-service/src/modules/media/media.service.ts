import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: any) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'cricheroes/images',
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  async uploadVideo(file: any) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      folder: 'cricheroes/videos',
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  async remove(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok' };
  }
}
