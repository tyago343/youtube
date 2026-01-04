import { Test, TestingModule } from '@nestjs/testing';
import { GetAllVideosWithOwnerUseCase } from '../use-cases/get-all-videos-with-owner.use-case';
import { VideosRepository, VideoWithOwner } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { User } from '../../../users/domain/user.entity';
import { UserId } from '../../../users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetAllVideosWithOwnerUseCase', () => {
  let useCase: GetAllVideosWithOwnerUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const ownerId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllVideosWithOwnerUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllVideosWithOwnerUseCase>(
      GetAllVideosWithOwnerUseCase,
    );
  });

  it('should return an empty list when there are no videos', async () => {
    videosRepositoryMocks.findAllWithOwner.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(videosRepositoryMocks.findAllWithOwner).toHaveBeenCalledTimes(1);
  });

  it('should return all videos with owners', async () => {
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

    const owner = User.create(
      ownerId,
      'owner@example.com',
      'owner',
      '$2b$10$hashedpassword',
    );

    const videosWithOwner: VideoWithOwner[] = [
      { video: video1, owner },
      { video: video2, owner },
    ];

    videosRepositoryMocks.findAllWithOwner.mockResolvedValue(videosWithOwner);

    const result = await useCase.execute();

    expect(result).toEqual(videosWithOwner);
    expect(result).toHaveLength(2);
    expect(result[0].video).toBe(video1);
    expect(result[0].owner).toBe(owner);
    expect(result[1].video).toBe(video2);
    expect(result[1].owner).toBe(owner);
    expect(videosRepositoryMocks.findAllWithOwner).toHaveBeenCalledTimes(1);
  });
});
