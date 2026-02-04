import { ApiProperty } from '@nestjs/swagger';
import { ReportResponseDto } from './report-response.dto';
import { VideoResponseDto } from 'src/modules/videos/presenters/http/dto/video-response.dto';
import { ChannelResponseDto } from 'src/modules/channels/presenters/http/dto/channel-response.dto';
import type { FullReport } from '../../../application/ports/reports.repository';

export class FullReportResponseDto {
  @ApiProperty({
    description: 'The report',
    type: ReportResponseDto,
  })
  report: ReportResponseDto;

  @ApiProperty({
    description:
      'The reported item: video (with channel) when reportableType is VIDEO, channel when CHANNEL, null for COMMENT/PLAYLIST/USER (future)',
    nullable: true,
  })
  reportableItem: VideoResponseDto | ChannelResponseDto | null;

  static fromDomain(fullReport: FullReport): FullReportResponseDto {
    const dto = new FullReportResponseDto();
    dto.report = ReportResponseDto.fromDomain(fullReport.report);
    if (fullReport.reportableItem === null) {
      dto.reportableItem = null;
      return dto;
    }
    const item = fullReport.reportableItem;
    if ('video' in item && 'channel' in item) {
      const videoWithChannel = item;
      dto.reportableItem = VideoResponseDto.fromDomain(
        videoWithChannel.video,
        videoWithChannel.channel,
      );
    } else {
      dto.reportableItem = ChannelResponseDto.fromDomain(item);
    }
    return dto;
  }
}
