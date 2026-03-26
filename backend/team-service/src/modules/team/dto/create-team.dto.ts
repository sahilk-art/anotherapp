import { IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsNotEmpty()
  @IsMongoId()
  captain: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  players?: string[];

  @IsOptional()
  @IsString()
  city?: string;
}
