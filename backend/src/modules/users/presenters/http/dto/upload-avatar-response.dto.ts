import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponseDto {
  @ApiProperty({
    description: 'The URL of the uploaded avatar',
    example: 'https://storage.example.com/avatars/user123.jpg',
  })
  avatarUrl: string;
}
