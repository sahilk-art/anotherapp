export class DLSCalculator {
  // Simplified resource table (Resources % for overs remaining at wickets lost)
  // row = overs remaining, col = wickets lost
  private static readonly resourcesTable = {
    50: [100.0, 93.4, 85.1, 74.9, 62.7, 49.0, 34.9, 22.0, 11.9, 4.7, 0.0],
    20: [56.6, 54.4, 51.5, 47.6, 42.5, 36.1, 28.5, 20.3, 12.0, 5.0, 0.0],
    10: [34.1, 33.4, 32.2, 30.5, 28.1, 24.9, 20.9, 15.9, 10.3, 4.8, 0.0],
    5: [19.8, 19.5, 19.1, 18.5, 17.6, 16.3, 14.5, 12.1, 8.8, 4.7, 0.0],
  };

  static calculateRevisedTarget(team1Score: number, r1: number, r2: number): number {
    if (r2 < r1) {
      return Math.floor(team1Score * (r2 / r1)) + 1;
    } else if (r2 > r1) {
      const g50 = 245; // Average score in 50 over match
      return Math.floor(team1Score + g50 * (r2 - r1) / 100) + 1;
    }
    return team1Score + 1;
  }

  static getResourcePercentage(oversRemaining: number, wicketsLost: number): number {
    // Linear interpolation between the static points in the table
    const keys = Object.keys(this.resourcesTable).map(Number).sort((a, b) => b - a);
    for (const key of keys) {
      if (oversRemaining >= key) return this.resourcesTable[key][wicketsLost];
    }
    return (oversRemaining / 5) * this.resourcesTable[5][wicketsLost];
  }
}
