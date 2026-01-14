import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChannelSchema } from './channel.schema';
import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';

@Entity('channel_status_changes')
export class ChannelStatusChangeSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  channelId: string;

  @ManyToOne(() => ChannelSchema)
  @JoinColumn({ name: 'channelId' })
  channel: ChannelSchema;

  @Column()
  fromStatus: string;

  @Column()
  toStatus: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ nullable: true })
  severity?: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserSchema, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdByUser?: UserSchema;
}
