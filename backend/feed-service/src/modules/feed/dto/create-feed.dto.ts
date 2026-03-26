import { IsNotEmpty, IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsMongoId()
  author: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
