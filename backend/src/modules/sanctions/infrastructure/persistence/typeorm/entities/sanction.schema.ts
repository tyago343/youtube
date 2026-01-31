import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from 'src/modules/users/infrastructure/persistence/typeorm/entities/user.schema';

@Entity('sanctions')
export class SanctionSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  sanctionType: string;

  @Column({ nullable: true })
  targetType?: string;

  @Column({ nullable: true })
  targetId?: string;

  @Column({ type: 'text' })
  messageBody: string;

  @Column()
  appliedByUserId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'appliedByUserId' })
  appliedBy: UserSchema;

  @Column()
  appliedAt: Date;

  @Column({ nullable: true })
  expiresAt?: Date;
}
