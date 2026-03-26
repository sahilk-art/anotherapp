import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ScoringGateway } from './scoring.gateway';

@Injectable()
export class ScoringService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private gateway: ScoringGateway,
  ) {}

  async start(matchId: string) {
    return { success: true, matchId };
  }

  async recordBall(data: any) {
    // In a real app, update MongoDB/Redis
    this.client.emit('ball_recorded', data);
    this.gateway.server.to(`match_${data.matchId}`).emit('score-update', data);
    return data;
  }

  async undoBall(matchId: string) {
    this.client.emit('undo_ball', { matchId });
    this.gateway.server.to(`match_${matchId}`).emit('undo-ball', { matchId });
    return { success: true };
  }

  async startInnings(matchId: string, data: any) {
    this.gateway.server.to(`match_${matchId}`).emit('innings-started', data);
    return { success: true };
  }

  async getCurrentState(matchId: string) {
    return { matchId, score: '100/2', overs: '12.4' };
  }

  async endMatch(matchId: string, data: any) {
    this.client.emit('match_ended', { matchId, ...data });
    this.gateway.server.to(`match_${matchId}`).emit('match-ended', data);
    return { success: true };
  }
}
