import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { Sanction } from '../../domain/sanction.entity';
import { SanctionTargetType } from '../../domain/vo/sanction-target-type.vo';
import { SanctionType } from '../../domain/vo/sanction-type.vo';
import { SanctionRepository } from '../ports/sanction.repository';
import { VideosRepository } from 'src/modules/videos/application/ports/videos.repository';
import { VideoNotFoundException } from 'src/modules/videos/domain/exceptions/video-not-found.exception';

export interface VideoRemovalSanctionInput {
  reportId: string;
  videoId: string;
  appliedByUserId: string;
  messageBody?: string;
}

export interface VideoRemovalSanctionResult {
  sanctionId: string;
}

@Injectable()
export class VideoRemovalSanctionUseCase {
  constructor(
    private readonly sanctionRepository: SanctionRepository,
    private readonly videoRepository: VideosRepository,
  ) {}

  async execute(
    input: VideoRemovalSanctionInput,
  ): Promise<VideoRemovalSanctionResult> {
    const video = await this.videoRepository.findById(input.videoId);
    if (!video) {
      throw new VideoNotFoundException(input.videoId);
    }

    const sanction = Sanction.create({
      id: randomUUID(),
      reportIds: [input.reportId],
      sanctionType: SanctionType.HIDE_CONTENT,
      targetType: SanctionTargetType.VIDEO,
      targetId: input.videoId,
      messageBody: input.messageBody ?? '',
      appliedByUserId: UserId.create(input.appliedByUserId),
      expiresAt: null,
    });

    video.ban();
    await this.videoRepository.update(video);
    await this.sanctionRepository.save(sanction);

    return { sanctionId: sanction.id.value };
  }
}
