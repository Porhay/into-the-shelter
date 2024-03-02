import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserRequest {
  @IsString()
  displayName?: string;

  @IsString() 
  avatar?: string;
}