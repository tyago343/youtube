import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ReportSchema } from './report.schema';
import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';

@Entity('report_watchers')
export class ReportWatcherSchema {
  @PrimaryColumn()
  reportId: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => ReportSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ReportSchema;

  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @CreateDateColumn()
  createdAt: Date;
}
