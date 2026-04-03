import { Ball } from './schemas/ball.schema';
import { ExtraType } from '../../../../../shared/enums';

export class CommentaryGenerator {
  static generate(ball: any): string {
    const { batsman, bowler, runs, extraType, isWicket, wicket } = ball;

    if (isWicket) {
      return `OUT! ${batsman} is ${wicket.type} by ${bowler}! Big blow for the batting side.`;
    }

    if (extraType === ExtraType.WIDE) {
      return `Wide ball! ${bowler} strays down the leg side. Extra run added.`;
    }

    if (extraType === ExtraType.NO_BALL) {
      return `No ball! ${bowler} has overstepped. Free hit coming up next!`;
    }

    if (runs === 4) {
      return `FOUR! ${batsman} finds the gap and it races away to the boundary! Beautiful shot.`;
    }

    if (runs === 6) {
      return `SIX! ${batsman} launches it high into the stands! What a massive hit!`;
    }

    if (runs === 0) {
      return `Dot ball. ${bowler} keeps it tight, ${batsman} defends solidly.`;
    }

    return `${batsman} pushes it for ${runs} run(s). Quick running between the wickets.`;
  }
}
