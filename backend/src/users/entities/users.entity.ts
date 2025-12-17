import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/videos/entities/video.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: 'The id of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    description: 'The username of the user',
    example: 'testuser',
  })
  @Column({ unique: true })
  username: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The avatar of the user',
    example: 'https://example.com/avatar.png',
  })
  avatarUrl: string;

  @OneToMany(() => Video, (video) => video.owner)
  videos: Video[];
}
