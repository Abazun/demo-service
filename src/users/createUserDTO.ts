import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;
  @IsOptional()
  lastName: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export interface FullUserDTO {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  createdAt: Date;
  accountStatus: 'active' | 'inactive';
  emailVerifiedAt?: string;
}
