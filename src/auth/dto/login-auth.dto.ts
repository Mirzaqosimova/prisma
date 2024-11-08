import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
