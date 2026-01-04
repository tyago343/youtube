import { Test, TestingModule } from '@nestjs/testing';
import { GetAllVideosUseCase } from '../use-cases/get-all-videos.use-case';
import { VideosRepository } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { UserId } from '../../../users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetAllVideosUseCase', () => {
  let useCase: GetAllVideosUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const ownerId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllVideosUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllVideosUseCase>(GetAllVideosUseCase);
  });

  it('should return an empty list when there are no videos', async () => {
    videosRepositoryMocks.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(videosRepositoryMocks.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return all videos', async () => {
    const video1 = Video.create({
      id: randomUUID(),
      title: 'Video 1',
      description: 'Description 1',
      url: 'https://example.com/video1.mp4',
      createdAt: new Date(),
      ownerId: UserId.create(ownerId),
    });

    const video2 = Video.create({
      id: randomUUID(),
      title: 'Video 2',
      description: 'Description 2',
      url: 'https://example.com/video2.mp4',
      createdAt: new Date(),
      ownerId: UserId.create(ownerId),
    });

    const videos = [video1, video2];
    videosRepositoryMocks.findAll.mockResolvedValue(videos);

    const result = await useCase.execute();

    expect(result).toEqual(videos);
    expect(result).toHaveLength(2);
    expect(videosRepositoryMocks.findAll).toHaveBeenCalledTimes(1);
  });
});

