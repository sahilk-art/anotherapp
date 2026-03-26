import { IsNotEmpty, IsString, IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { MatchType } from '../../../shared/enums';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  teamA: string;

  @IsNotEmpty()
  @IsMongoId()
  teamB: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsOptional()
  @IsEnum(MatchType)
  matchType?: MatchType;
}
