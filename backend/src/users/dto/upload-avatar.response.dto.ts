import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponseDto {
  @ApiProperty({
    description: 'The avatar image',
    type: 'string',
    example: 'https://example.com/avatar.png',
  })
  avatarUrl: string;
}
