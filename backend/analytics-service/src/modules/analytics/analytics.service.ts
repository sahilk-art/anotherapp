import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Innings } from '../scoring/schemas/innings.schema';
import { Ball } from '../scoring/schemas/ball.schema';
import { DismissalType, WinType, MatchType } from '../../../../../shared/enums';
import { oversToDecimal } from '../../../../shared/utils/cricket-math';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @InjectModel(Ball.name) private ballModel: Model<Ball>,
  ) {}

  async calculateMVP(matchId: string): Promise<any[]> {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) throw new NotFoundException('Match not found');
    const innings = await this.inningsModel.find({ match: matchId }).exec();

    const playerScores = new Map<string, any>();
    const allPlayers = [...(match.teamA.playingXI || []), ...(match.teamB.playingXI || [])];
    allPlayers.forEach(id => {
      playerScores.set(id.toString(), { batting: 0, bowling: 0, fielding: 0, bonus: 0, total: 0 });
    });

    for (const inn of innings) {
      inn.battingOrder.forEach(b => {
        let p = playerScores.get(b.batsman.toString()) || { batting: 0, bowling: 0, fielding: 0, bonus: 0, total: 0 };
        let points = b.runs;
        if (b.runs >= 100) points += 20;
        else if (b.runs >= 50) points += 10;
        points += (b.fours * 2) + (b.sixes * 3);
        const sr = (b.runs / (b.balls || 1)) * 100;
        if (b.balls >= 20 && sr > 150) points += 5;
        if (b.balls >= 15 && sr > 200) points += 10;
        if (b.runs === 0 && b.isOut) points -= 5;
        const isSuccessfulChase = match.result && (match.result as any).winner?.toString() === inn.battingTeam.toString();
        if (!b.isOut && isSuccessfulChase && inn.inningsNumber === 2) points += 10;
        p.batting += points;
        playerScores.set(b.batsman.toString(), p);
      });

      inn.bowlingOrder.forEach(bow => {
        let p = playerScores.get(bow.bowler.toString()) || { batting: 0, bowling: 0, fielding: 0, bonus: 0, total: 0 };
        let points = bow.wickets * 25;
        if (bow.wickets >= 5) points += 15;
        else if (bow.wickets >= 3) points += 5;
        points += (bow.maidens * 10);
        const eco = bow.runs / (oversToDecimal(bow.overs) || 0.1);
        if (bow.overs >= 2) {
          if (eco < 3.0) points += 10;
          else if (eco < 4.0) points += 5;
          else if (eco > 12.0) points -= 5;
        }
        p.bowling += points;
        playerScores.set(bow.bowler.toString(), p);
      });

      const balls = await this.ballModel.find({ innings: inn._id, isWicket: true }).exec();
      balls.forEach(ball => {
        if ((ball.wicketType === DismissalType.CAUGHT || ball.wicketType === DismissalType.STUMPED || ball.wicketType === DismissalType.RUN_OUT) && (ball as any).fielder) {
          const fid = (ball as any).fielder.toString();
          let p = playerScores.get(fid) || { batting: 0, bowling: 0, fielding: 0, bonus: 0, total: 0 };
          if (ball.wicketType === DismissalType.CAUGHT) p.fielding += 10;
          else if (ball.wicketType === DismissalType.STUMPED) p.fielding += 15;
          else if (ball.wicketType === DismissalType.RUN_OUT) p.fielding += (ball as any).isDirectHit ? 15 : 10;
          playerScores.set(fid, p);
        }
      });
    }

    if (match.status === 'COMPLETED' && (match.result as any)?.winner) {
      const winnerId = (match.result as any).winner.toString();
      playerScores.forEach((p, id) => {
        const isWinner = match.teamA.team.toString() === winnerId ? match.teamA.playingXI.some(pid => pid.toString() === id) : match.teamB.playingXI.some(pid => pid.toString() === id);
        if (isWinner) p.bonus += 15;
        if ((match.result as any).manOfTheMatch?.toString() === id) p.bonus += 25;
      });
    }

    return Array.from(playerScores.entries()).map(([id, p]) => ({
      playerId: id, ...p, total: p.batting + p.bowling + p.fielding + p.bonus
    })).sort((a, b) => b.total - a.total);
  }

  async getManhattanData(matchId: string) {
    const innings = await this.inningsModel.find({ match: matchId }).sort({ inningsNumber: 1 }).exec();
    const result = [];
    for (const inn of innings) {
      const balls = await this.ballModel.find({ innings: inn._id }).exec();
      const overs = new Array(20).fill(0).map((_, i) => ({ over: i + 1, runs: 0, wickets: 0 }));
      balls.forEach(b => {
        if (b.overNumber < 20) {
          overs[b.overNumber].runs += (b.runs + b.extras);
          if (b.isWicket) overs[b.overNumber].wickets++;
        }
      });
      result.push({ innings: inn.inningsNumber, team: inn.battingTeamName, data: overs });
    }
    return result;
  }

  async getWormChartData(matchId: string) {
    const innings = await this.inningsModel.find({ match: matchId }).sort({ inningsNumber: 1 }).exec();
    const result = [];
    for (const inn of innings) {
      const balls = await this.ballModel.find({ innings: inn._id }).sort({ overNumber: 1, ballNumber: 1 }).exec();
      let cumulativeRuns = 0;
      const points = balls.map(b => {
        cumulativeRuns += (b.runs + b.extras);
        return { over: b.overNumber + (b.ballNumber / 6), runs: cumulativeRuns };
      });
      result.push({ innings: inn.inningsNumber, team: inn.battingTeamName, data: points });
    }
    return result;
  }

  async getWagonWheel(matchId: string, playerId: string) {
    const balls = await this.ballModel.find({ match: matchId, batsman: playerId }).exec();
    return balls.map(b => ({
      runs: b.runs,
      angle: (b as any).shotAngle || Math.random() * 360,
      coordinates: (b as any).shotCoordinates,
    }));
  }

  async getPhaseAnalysis(matchId: string) {
    const innings = await this.inningsModel.find({ match: matchId }).sort({ inningsNumber: 1 }).exec();
    const result: any = {};
    for (const inn of innings) {
      const balls = await this.ballModel.find({ innings: inn._id }).sort({ overNumber: 1, ballNumber: 1 }).exec();
      const phases = {
        powerplay: { runs: 0, wickets: 0, balls: 0, boundaries: 0, dots: 0 },
        middle: { runs: 0, wickets: 0, balls: 0, boundaries: 0, dots: 0 },
        death: { runs: 0, wickets: 0, balls: 0, boundaries: 0, dots: 0 }
      };
      balls.forEach(ball => {
        let phase: 'powerplay' | 'middle' | 'death';
        if (ball.overNumber < 6) phase = 'powerplay';
        else if (ball.overNumber < 15) phase = 'middle';
        else phase = 'death';
        phases[phase].runs += (ball.runs + ball.extras);
        if (ball.isWicket) phases[phase].wickets++;
        phases[phase].balls++;
        if (ball.runs === 4 || ball.runs === 6) phases[phase].boundaries++;
        if (ball.runs === 0 && ball.extras === 0) phases[phase].dots++;
      });
      result[`innings${inn.inningsNumber}`] = phases;
    }
    return result;
  }

  async getHeadToHead(team1Id: string, team2Id: string) {
    const matches = await this.matchModel.find({
      $or: [{ 'teamA.team': team1Id, 'teamB.team': team2Id }, { 'teamA.team': team2Id, 'teamB.team': team1Id }],
      status: 'COMPLETED'
    }).exec();
    const team1Wins = matches.filter(m => (m.result as any)?.winner?.toString() === team1Id).length;
    const team2Wins = matches.filter(m => (m.result as any)?.winner?.toString() === team2Id).length;
    return {
      totalMatches: matches.length, team1Wins, team2Wins, draws: matches.length - team1Wins - team2Wins,
      matches: matches.map(m => ({
        matchId: m._id, date: m.matchDate, winner: (m.result as any)?.winner,
        score1: (m as any).teamA?.runs, score2: (m as any).teamB?.runs
      }))
    };
  }

  async generateHighlights(matchId: string) { return { status: 'GENERATING' }; }
  async comparePlayers(p1: string, p2: string) { return { player1: {}, player2: {} }; }
  async checkAchievements(uId: string, mId: string) { return []; }
  async updateLiveCharts(mId: string, iId: string) { return true; }
  async calculateFinalMVP(mId: string) { return true; }
  async generateMatchReport(mId: string) { return true; }
}
