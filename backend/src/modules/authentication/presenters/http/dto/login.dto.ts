import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user. Must be a valid email address',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The password of the user. Must be at least 8 characters long.',
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
