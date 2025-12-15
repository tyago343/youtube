import { User } from '@users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (owner) => owner.videos)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  published: Date;
}
