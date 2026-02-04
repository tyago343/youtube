import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RequireModerator } from 'src/modules/authentication/presenters/http/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/authentication/infrastructure/guards/roles.guard';
import { GetAllReportsUseCase } from '../../application/use-cases/get-all-reports.use-case';
import { GetFullReportUseCase } from '../../application/use-cases/get-full-report.use-case';
import { ReportResponseDto } from './dto/report-response.dto';
import { FullReportResponseDto } from './dto/full-report-response.dto';

@ApiTags('Reports (Moderation)')
@Controller('moderation/reports')
@UseGuards(RolesGuard)
@RequireModerator()
export class ReportsController {
  constructor(
    private readonly getAllReportsUseCase: GetAllReportsUseCase,
    private readonly getFullReportUseCase: GetFullReportUseCase,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all reports',
    description:
      'Returns all reports. Only accessible by users with MODERATOR or LEGAL role.',
  })
  @ApiOkResponse({
    description: 'Reports retrieved successfully',
    type: [ReportResponseDto],
  })
  async getAll(): Promise<ReportResponseDto[]> {
    const reports = await this.getAllReportsUseCase.execute();
    return reports.map((report) => ReportResponseDto.fromDomain(report));
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get full report',
    description:
      'Returns a report by id with its reportable item (video with channel, or channel). Only accessible by users with MODERATOR or LEGAL role.',
  })
  @ApiParam({ name: 'id', description: 'Report UUID' })
  @ApiOkResponse({
    description: 'Full report retrieved successfully',
    type: FullReportResponseDto,
  })
  async getById(@Param('id') id: string): Promise<FullReportResponseDto> {
    const fullReport = await this.getFullReportUseCase.execute({ id });
    return FullReportResponseDto.fromDomain(fullReport);
  }
}
