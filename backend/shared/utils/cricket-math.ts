export interface IMatchResult {
  runsScored: number;
  oversFaced: number; // e.g., 18.3
  wasAllOut: boolean;
  totalAllocatedOvers: number;
  runsConceded: number;
  oversBowled: number;
  opponentWasAllOut: boolean;
}

export function oversToDecimal(overs: number): number {
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  return fullOvers + (balls / 6);
}

export function calculateNRR(teamMatches: IMatchResult[]): number {
  let totalRunsScored = 0;
  let totalOversFaced = 0;
  let totalRunsConceded = 0;
  let totalOversBowled = 0;

  for (const match of teamMatches) {
    totalRunsScored += match.runsScored;
    totalOversFaced += match.wasAllOut ? match.totalAllocatedOvers : oversToDecimal(match.oversFaced);

    totalRunsConceded += match.runsConceded;
    totalOversBowled += match.opponentWasAllOut ? match.totalAllocatedOvers : oversToDecimal(match.oversBowled);
  }

  if (totalOversFaced === 0 || totalOversBowled === 0) return 0;

  const scoringRate = totalRunsScored / totalOversFaced;
  const concedingRate = totalRunsConceded / totalOversBowled;

  return parseFloat((scoringRate - concedingRate).toFixed(3));
}
