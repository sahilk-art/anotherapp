import { calculateNRR, IMatchResult, oversToDecimal } from '../utils/cricket-math';

describe('CricketMath Utils', () => {
  describe('oversToDecimal', () => {
    it('should convert 15.2 to 15.333', () => {
      expect(oversToDecimal(15.2)).toBeCloseTo(15.333, 3);
    });
    it('should convert 18.5 to 18.833', () => {
      expect(oversToDecimal(18.5)).toBeCloseTo(18.833, 3);
    });
  });

  describe('calculateNRR', () => {
    it('should calculate correct NRR for a simple match', () => {
      const results: IMatchResult[] = [{
        runsScored: 120,
        oversFaced: 20,
        wasAllOut: false,
        totalAllocatedOvers: 20,
        runsConceded: 100,
        oversBowled: 20,
        opponentWasAllOut: false
      }];
      expect(calculateNRR(results)).toBe(1.0); // (120/20) - (100/20) = 6 - 5 = 1
    });

    it('should handle all-out logic correctly', () => {
      const results: IMatchResult[] = [{
        runsScored: 120,
        oversFaced: 18.3,
        wasAllOut: true, // Should use 20 overs
        totalAllocatedOvers: 20,
        runsConceded: 100,
        oversBowled: 20,
        opponentWasAllOut: false
      }];
      expect(calculateNRR(results)).toBe(1.0); // (120/20) - (100/20) = 1
    });
  });
});
