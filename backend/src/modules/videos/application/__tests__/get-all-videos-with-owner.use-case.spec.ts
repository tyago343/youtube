import { Test, TestingModule } from '@nestjs/testing';
import { GetAllVideosWithChannelUseCase } from '../use-cases/get-all-videos-with-owner.use-case';
import { VideosRepository, VideoWithChannel } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetAllVideosWithChannelUseCase', () => {
  let useCase: GetAllVideosWithChannelUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const channelId = randomUUID();
  const ownerId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllVideosWithChannelUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllVideosWithChannelUseCase>(
      GetAllVideosWithChannelUseCase,
    );
  });

  it('should return an empty list when there are no videos', async () => {
    videosRepositoryMocks.findAllWithChannel.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(videosRepositoryMocks.findAllWithChannel).toHaveBeenCalledTimes(1);
  });

  it('should return all videos with channels', async () => {
    const video1 = Video.create({
      id: randomUUID(),
      title: 'Video 1',
      description: 'Description 1',
      url: 'https://example.com/video1.mp4',
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    const video2 = Video.create({
      id: randomUUID(),
      title: 'Video 2',
      description: 'Description 2',
      url: 'https://example.com/video2.mp4',
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    const channel = Channel.create({
      id: channelId,
      ownerId: UserId.create(ownerId),
      name: 'Test Channel',
      description: 'Test Description',
    });

    const videosWithChannel: VideoWithChannel[] = [
      { video: video1, channel },
      { video: video2, channel },
    ];

    videosRepositoryMocks.findAllWithChannel.mockResolvedValue(
      videosWithChannel,
    );

    const result = await useCase.execute();

    expect(result).toEqual(videosWithChannel);
    expect(result).toHaveLength(2);
    expect(result[0].video).toBe(video1);
    expect(result[0].channel).toBe(channel);
    expect(result[1].video).toBe(video2);
    expect(result[1].channel).toBe(channel);
    expect(videosRepositoryMocks.findAllWithChannel).toHaveBeenCalledTimes(1);
  });
});
