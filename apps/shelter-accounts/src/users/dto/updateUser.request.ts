import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserRequest {
  @IsString()
  @IsNotEmpty()
  displayName: string;
}