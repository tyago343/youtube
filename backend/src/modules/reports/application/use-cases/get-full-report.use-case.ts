import { Injectable } from '@nestjs/common';
import {
  ReportsRepository,
  type FullReport,
} from '../ports/reports.repository';
import { ReportId } from '../../domain/vo/report-id.vo';
import { ReportNotFoundException } from '../../domain/exceptions/report-not-found.exception';

export interface GetFullReportInput {
  id: string;
}

export type GetFullReportResult = FullReport;

@Injectable()
export class GetFullReportUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: GetFullReportInput): Promise<GetFullReportResult> {
    const reportId = ReportId.create(input.id);
    const result =
      await this.reportsRepository.findByIdWithReportable(reportId);
    if (!result) {
      throw new ReportNotFoundException();
    }
    return result;
  }
}
