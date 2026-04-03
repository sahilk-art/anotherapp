import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { TeamController } from './team.controller';
import { MatchController, ConfigController } from './match.controller';
import { ScoringController } from './scoring.controller';
import { TournamentController } from './tournament.controller';
import { FeedController, LeaderboardController, SearchController, NotificationController, AnalyticsController, MediaController } from './remaining.controller';
import { StreamingController, ChatController, PaymentController, SubscriptionController, VenueController } from './new-services.controller';
import { AdminController } from './admin.controller';
import { CustomLogger } from './common/helpers/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'TEAM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'team_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'MATCH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'match_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'SCORING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'scoring_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'TOURNAMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'tournament_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'analytics_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'FEED_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'feed_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'notification_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'MEDIA_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'media_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'SEARCH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'search_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'LEADERBOARD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'leaderboard_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'STREAMING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'streaming_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'chat_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'payment_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'VENUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'venue_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    TeamController,
    MatchController,
    ScoringController,
    TournamentController,
    FeedController,
    LeaderboardController,
    SearchController,
    NotificationController,
    AnalyticsController,
    MediaController,
    StreamingController,
    ChatController,
    PaymentController,
    SubscriptionController,
    AdminController,
    VenueController,
    ConfigController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CustomLogger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
