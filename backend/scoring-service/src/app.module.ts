import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScoringModule } from './modules/scoring/scoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScoringModule,
  ],
})
export class AppModule {}
