import { Test, TestingModule } from '@nestjs/testing';
import { GetVideoUseCase } from '../use-cases/get-video.use-case';
import { VideosRepository } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetVideoUseCase', () => {
  let useCase: GetVideoUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const videoId = randomUUID();
  const channelId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVideoUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetVideoUseCase>(GetVideoUseCase);
  });

  it('should get a video by id', async () => {
    const video = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: 'https://example.com/video.mp4',
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    videosRepositoryMocks.findById.mockResolvedValue(video);

    const result = await useCase.execute(videoId);

    expect(result).toBe(video);
    expect(videosRepositoryMocks.findById).toHaveBeenCalledWith(videoId);
    expect(videosRepositoryMocks.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw VideoNotFoundException when video does not exist', async () => {
    videosRepositoryMocks.findById.mockResolvedValue(null);

    await expect(useCase.execute(videoId)).rejects.toThrow(
      VideoNotFoundException,
    );

    expect(videosRepositoryMocks.findById).toHaveBeenCalledWith(videoId);
    expect(videosRepositoryMocks.findById).toHaveBeenCalledTimes(1);
  });
});
