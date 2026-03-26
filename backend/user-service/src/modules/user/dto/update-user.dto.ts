import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../../shared/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
