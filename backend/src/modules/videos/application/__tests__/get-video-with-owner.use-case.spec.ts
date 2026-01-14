import { Test, TestingModule } from '@nestjs/testing';
import { GetVideoWithChannelUseCase } from '../use-cases/get-video-with-owner.use-case';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';
import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetVideoWithChannelUseCase', () => {
  let useCase: GetVideoWithChannelUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const videoId = randomUUID();
  const channelId = randomUUID();
  const ownerId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVideoWithChannelUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetVideoWithChannelUseCase>(
      GetVideoWithChannelUseCase,
    );
  });

  it('should get a video with channel by id', async () => {
    const video = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: 'https://example.com/video.mp4',
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    const channel = Channel.create({
      id: channelId,
      ownerId: UserId.create(ownerId),
      name: 'Test Channel',
      description: 'Test Description',
    });

    const videoWithChannel: VideoWithChannel = { video, channel };

    videosRepositoryMocks.findByIdWithChannel.mockResolvedValue(
      videoWithChannel,
    );

    const result = await useCase.execute(videoId);

    expect(result).toBe(videoWithChannel);
    expect(result.video).toBe(video);
    expect(result.channel).toBe(channel);
    expect(videosRepositoryMocks.findByIdWithChannel).toHaveBeenCalledWith(
      videoId,
    );
    expect(videosRepositoryMocks.findByIdWithChannel).toHaveBeenCalledTimes(1);
  });

  it('should throw VideoNotFoundException when video does not exist', async () => {
    videosRepositoryMocks.findByIdWithChannel.mockResolvedValue(null);

    await expect(useCase.execute(videoId)).rejects.toThrow(
      VideoNotFoundException,
    );

    expect(videosRepositoryMocks.findByIdWithChannel).toHaveBeenCalledWith(
      videoId,
    );
    expect(videosRepositoryMocks.findByIdWithChannel).toHaveBeenCalledTimes(1);
  });
});
