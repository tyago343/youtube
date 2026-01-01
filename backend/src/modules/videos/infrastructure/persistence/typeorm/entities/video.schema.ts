import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('videos')
export class VideoSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Column()
  thumbnailUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  ownerId: string;

  @ManyToOne(() => UserSchema, (owner) => owner.videos)
  @JoinColumn({ name: 'ownerId' })
  owner: UserSchema;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  published?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
