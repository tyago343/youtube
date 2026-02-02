import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../ports/reports.repository';
import { Report } from '../../domain/report.entity';

@Injectable()
export class GetAllReportsUseCase {
  constructor(private readonly reportRepository: ReportsRepository) {}

  async execute(): Promise<Report[]> {
    return await this.reportRepository.findAll();
  }
}
