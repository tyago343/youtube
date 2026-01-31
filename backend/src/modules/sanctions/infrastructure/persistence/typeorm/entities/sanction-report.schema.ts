import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { SanctionSchema } from './sanction.schema';
import { ReportSchema } from 'src/modules/reports/infrastructure/persistence/typeorm/entities/report.schema';

@Entity('sanction_reports')
export class SanctionReportSchema {
  @PrimaryColumn()
  sanctionId: string;

  @PrimaryColumn()
  reportId: string;

  @ManyToOne(() => SanctionSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sanctionId' })
  sanction: SanctionSchema;

  @ManyToOne(() => ReportSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ReportSchema;

  @CreateDateColumn()
  createdAt: Date;
}
