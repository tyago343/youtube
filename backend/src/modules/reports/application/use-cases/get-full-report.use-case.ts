import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../ports/reports.repository';
import { ReportId } from '../../domain/vo/report-id.vo';
import { ReportNotFoundException } from '../../domain/exceptions/report-not-found.exception';
import type { FullReport } from '../ports/reports.repository';

@Injectable()
export class GetFullReportUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(id: string): Promise<FullReport> {
    const result = await this.reportsRepository.findByIdWithReportable(
      ReportId.create(id),
    );
    if (!result) {
      throw new ReportNotFoundException();
    }
    return result;
  }
}
