import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
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
    description: 'The owner id of the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
  @ApiProperty({
    description: 'The video file',
    example: 'video.mp4',
  })
  @IsNotEmptyObject()
  video: Express.Multer.File;
  @ApiProperty({
    description: 'The thumbnail file',
    example: 'thumbnail.png',
  })
  @IsNotEmptyObject()
  thumbnail: Express.Multer.File;
}
