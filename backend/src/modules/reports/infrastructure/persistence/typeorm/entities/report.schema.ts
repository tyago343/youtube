import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';

@Entity('reports')
export class ReportSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  reporterUserId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'reporterUserId' })
  reporter: UserSchema;

  @Column()
  reportableType: string;

  @Column()
  reportableId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column()
  severity: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  assignedToUserId?: string;

  @ManyToOne(() => UserSchema, { nullable: true })
  @JoinColumn({ name: 'assignedToUserId' })
  assignedTo?: UserSchema;

  @Column({ nullable: true })
  escalatedToLegalAt?: Date;

  @Column({ nullable: true })
  rejectedEscalationAt?: Date;

  @Column({ nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
