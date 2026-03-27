import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { LiveStream, LiveStreamSchema } from './schemas/live-stream.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LiveStream.name, schema: LiveStreamSchema }]),
  ],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
