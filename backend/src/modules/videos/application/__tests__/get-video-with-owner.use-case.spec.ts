import { Test, TestingModule } from '@nestjs/testing';
import { GetVideoWithOwnerUseCase } from '../use-cases/get-video-with-owner.use-case';
import { VideosRepository, VideoWithOwner } from '../ports/videos.repository';
import { Video } from '../../domain/video.entity';
import { VideoNotFoundException } from '../../domain/exceptions/video-not-found.exception';
import { User } from '../../../users/domain/user.entity';
import { UserId } from '../../../users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import { createVideosRepositoryMocks } from './mocks';

describe('GetVideoWithOwnerUseCase', () => {
  let useCase: GetVideoWithOwnerUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;

  const videoId = randomUUID();
  const ownerId = randomUUID();

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVideoWithOwnerUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
      ],
    }).compile();

    useCase = module.get<GetVideoWithOwnerUseCase>(GetVideoWithOwnerUseCase);
  });

  it('should get a video with owner by id', async () => {
    const video = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: 'https://example.com/video.mp4',
      createdAt: new Date(),
      ownerId: UserId.create(ownerId),
    });

    const owner = User.create(
      ownerId,
      'owner@example.com',
      'owner',
      '$2b$10$hashedpassword',
    );

    const videoWithOwner: VideoWithOwner = { video, owner };

    videosRepositoryMocks.findByIdWithOwner.mockResolvedValue(videoWithOwner);

    const result = await useCase.execute(videoId);

    expect(result).toBe(videoWithOwner);
    expect(result.video).toBe(video);
    expect(result.owner).toBe(owner);
    expect(videosRepositoryMocks.findByIdWithOwner).toHaveBeenCalledWith(
      videoId,
    );
    expect(videosRepositoryMocks.findByIdWithOwner).toHaveBeenCalledTimes(1);
  });

  it('should throw VideoNotFoundException when video does not exist', async () => {
    videosRepositoryMocks.findByIdWithOwner.mockResolvedValue(null);

    await expect(useCase.execute(videoId)).rejects.toThrow(
      VideoNotFoundException,
    );

    expect(videosRepositoryMocks.findByIdWithOwner).toHaveBeenCalledWith(
      videoId,
    );
    expect(videosRepositoryMocks.findByIdWithOwner).toHaveBeenCalledTimes(1);
  });
});
