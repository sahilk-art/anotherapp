import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordBallDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inningsId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  runs: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['WIDE', 'NO_BALL', 'BYES', 'LEG_BYES'])
  extraType?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isWicket: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  wicketType?: string;
}

export class UndoBallDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;
}

export class SelectBatsmanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batsmanId: string;

  @ApiProperty({ description: 'true for striker, false for non-striker' })
  @IsBoolean()
  isStriker: boolean;
}

export class SelectBowlerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bowlerId: string;
}
