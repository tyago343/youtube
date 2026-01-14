import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'The title of the video',
    example: 'My first video',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the video',
    example: 'This is a description of my first video',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The channel id that owns the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({
    description: 'The visibility of the video',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'PRIVATE', 'MEMBERS'],
    required: false,
    default: 'PRIVATE',
  })
  @IsOptional()
  @IsString()
  @IsIn(['PUBLIC', 'PRIVATE', 'MEMBERS'])
  visibility?: string;
}
