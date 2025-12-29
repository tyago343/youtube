import { VideoSchema } from 'src/modules/videos/infrastructure/persistence/typeorm/entities/video.schema';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => VideoSchema, (video) => video.owner)
  videos: VideoSchema[];
}
