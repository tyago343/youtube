import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username: string;
  @IsString()
  @MinLength(8)
  password: string;
}
