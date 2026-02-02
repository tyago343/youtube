import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequireModerator } from 'src/modules/authentication/presenters/http/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/authentication/infrastructure/guards/roles.guard';
import { GetAllReportsUseCase } from '../../application/use-cases/get-all-reports.use-case';
import { ReportResponseDto } from './dto/report-response.dto';

@ApiTags('Reports (Moderation)')
@Controller('moderation/reports')
@UseGuards(RolesGuard)
@RequireModerator()
export class ReportsController {
  constructor(private readonly getAllReportsUseCase: GetAllReportsUseCase) {}

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
}
