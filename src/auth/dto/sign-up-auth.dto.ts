import {
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from '@nestjs/class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SignUp {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;
}
