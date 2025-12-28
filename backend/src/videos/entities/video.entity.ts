import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/presenters/http/dto/user-response.dto';
import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Video {
  @ApiProperty({
    description: 'The id of the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    description: 'The title of the video',
    example: 'My first video',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the video',
    example: 'This is a description of my first video',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'The URL of the video',
    example: 'https://example.com/video.mp4',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: 'The URL of the thumbnail',
    example: 'https://example.com/thumbnail.png',
  })
  @Column()
  thumbnailUrl: string;

  @ApiProperty({
    description: 'The created at date of the video',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Column()
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the video',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Column()
  updatedAt: Date;

  @ApiProperty({
    description: 'The owner id of the video',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  ownerId: string;

  @ApiProperty({
    description: 'The owner of the video',
    type: UserResponseDto,
  })
  @ManyToOne(() => UserSchema, (owner) => owner.videos)
  @JoinColumn({ name: 'ownerId' })
  owner: UserSchema;

  @ApiProperty({
    description: 'The views of the video',
    example: 100,
  })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({
    description: 'The likes of the video',
    example: 100,
  })
  @Column({ default: 0 })
  likes: number;

  @ApiProperty({
    description: 'The dislikes of the video',
    example: 100,
  })
  @Column({ default: 0 })
  dislikes: number;

  @ApiProperty({
    description: 'Whether the video is public',
    example: true,
  })
  @Column({ default: false })
  isPublic: boolean;

  @ApiProperty({
    description: 'The published date of the video',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Column({ nullable: true })
  published: Date;
}
