export interface IUser {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  displayName?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
}

export interface ITeam {
  id: string;
  name: string;
  logo?: string;
  captainId: string;
  players: string[];
}

export interface IMatch {
  id: string;
  teamA: string;
  teamB: string;
  tossWinner?: string;
  tossDecision?: 'BAT' | 'BOWL';
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  overs: number;
  currentInnings?: number;
}

export interface IBallRecord {
  matchId: string;
  inningsId: string;
  over: number;
  ball: number;
  batsmanId: string;
  bowlerId: string;
  runs: number;
  extras: number;
  extraType?: 'WIDE' | 'NO_BALL' | 'BYES' | 'LEG_BYES';
  isWicket: boolean;
  wicketType?: string;
}

export interface IScoringState {
  matchId: string;
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  currentInnings: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
}
