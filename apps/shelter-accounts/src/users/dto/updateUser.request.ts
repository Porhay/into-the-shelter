import { IsString, IsInt } from 'class-validator';

export class updateUserRequest {
  @IsString()
  displayName?: string;

  @IsString()
  avatar?: string;

  @IsInt()
  coins?: number;
}
