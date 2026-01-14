import { ChannelSchema } from 'src/modules/channels/infrastructure/persistence/typeorm/entities/channel.schema';
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
  channelId: string;

  @ManyToOne(() => ChannelSchema, (channel) => channel.videos)
  @JoinColumn({ name: 'channelId' })
  channel: ChannelSchema;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @Column({ default: 'PRIVATE' })
  visibility: string;

  @Column({ nullable: true })
  published?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
