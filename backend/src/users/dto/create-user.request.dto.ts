import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user. Must be a valid email address',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description:
      'The username of the user. Must be at least 5 characters long and less than 15 characters long',
    example: 'testuser',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username: string;
  @ApiProperty({
    description:
      'The password of the user. Must be at least 8 characters long.',
    example: 'password',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
