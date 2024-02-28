// import {
//     IsNotEmpty,
//     IsPhoneNumber,
//     IsPositive,
//     IsString,
//   } from 'class-validator';
  
//   export class CreateUserRequest {
//     @IsString()
//     @IsNotEmpty()
//     name: string;
  
//     @IsPositive()
//     price: number;
  
//     @IsPhoneNumber()
//     phoneNumber: string;
//   }
  

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}