import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';
import { VideoSchema } from 'src/modules/videos/infrastructure/persistence/typeorm/entities/video.schema';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('channels')
export class ChannelSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => UserSchema, (user) => user.channels)
  @JoinColumn({ name: 'ownerId' })
  owner: UserSchema;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  bannerUrl?: string;

  @Column({ default: false })
  isMonetizationEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => VideoSchema, (video) => video.channel, {
    cascade: false,
  })
  videos: VideoSchema[];
}
