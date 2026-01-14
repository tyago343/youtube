/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateVideoUseCase } from '../use-cases/create-video.use-case';
import { VideosRepository } from '../ports/videos.repository';
import { FileStorageService } from 'src/modules/shared/application/ports/file-storage.interface';
import { ChannelRepository } from 'src/modules/channels/application/ports/channel.repository';
import { VideoFactory } from '../../domain/factories/video.factory';
import { Video } from '../../domain/video.entity';
import { Channel } from 'src/modules/channels/domain/channel.entity';
import { ChannelNotFoundException } from 'src/modules/channels/domain/exceptions/channel-not-found.exception';
import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { UserId } from 'src/modules/users/domain/vo/user-id.vo';
import { randomUUID } from 'crypto';
import {
  createVideosRepositoryMocks,
  createFileStorageMocks,
  createVideoFactoryMocks,
} from './mocks';
import { createChannelRepositoryMocks } from 'src/modules/channels/application/__tests__/mocks';

describe('CreateVideoUseCase', () => {
  let useCase: CreateVideoUseCase;
  let videosRepositoryMocks: ReturnType<typeof createVideosRepositoryMocks>;
  let fileStorageMocks: ReturnType<typeof createFileStorageMocks>;
  let channelRepositoryMocks: ReturnType<typeof createChannelRepositoryMocks>;
  let videoFactoryMocks: ReturnType<typeof createVideoFactoryMocks>;

  const channelId = randomUUID();
  const ownerId = randomUUID();
  const videoId = randomUUID();
  const videoUrl = 'https://storage.example.com/videos/video123.mp4';
  const thumbnailUrl = 'https://storage.example.com/thumbnails/thumb123.jpg';

  const mockVideoFile: Express.Multer.File = {
    fieldname: 'video',
    originalname: 'test-video.mp4',
    encoding: '7bit',
    mimetype: 'video/mp4',
    size: 1024 * 1024 * 10, // 10MB
    buffer: Buffer.from('fake video content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  const mockThumbnailFile: Express.Multer.File = {
    fieldname: 'thumbnail',
    originalname: 'test-thumbnail.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 100, // 100KB
    buffer: Buffer.from('fake image content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  beforeEach(async () => {
    videosRepositoryMocks = createVideosRepositoryMocks();
    fileStorageMocks = createFileStorageMocks();
    channelRepositoryMocks = createChannelRepositoryMocks();
    videoFactoryMocks = createVideoFactoryMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVideoUseCase,
        {
          provide: VideosRepository,
          useValue: videosRepositoryMocks.repository,
        },
        {
          provide: FileStorageService,
          useValue: fileStorageMocks.service,
        },
        {
          provide: ChannelRepository,
          useValue: channelRepositoryMocks.repository,
        },
        {
          provide: VideoFactory,
          useValue: videoFactoryMocks.factory,
        },
      ],
    }).compile();

    useCase = module.get<CreateVideoUseCase>(CreateVideoUseCase);
  });

  it('should create a video successfully', async () => {
    const channel = Channel.create({
      id: channelId,
      ownerId: UserId.create(ownerId),
      name: 'Test Channel',
      description: 'Test Description',
    });

    const createdVideo = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: videoUrl,
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    fileStorageMocks.uploadFile.mockResolvedValue({ url: videoUrl });
    channelRepositoryMocks.findById.mockResolvedValue(channel);
    videoFactoryMocks.create.mockReturnValue(createdVideo);
    videosRepositoryMocks.create.mockResolvedValue(createdVideo);

    const result = await useCase.execute(mockVideoFile, {
      title: 'Test Video',
      description: 'Test Description',
      channelId,
    });

    expect(result).toBe(createdVideo);
    expect(fileStorageMocks.uploadFile).toHaveBeenCalledWith(mockVideoFile, {
      folder: 'videos',
    });
    expect(channelRepositoryMocks.findById).toHaveBeenCalledWith(
      expect.any(ChannelId),
    );
    expect(videoFactoryMocks.create).toHaveBeenCalled();
    expect(videosRepositoryMocks.create).toHaveBeenCalledWith(createdVideo);
  });

  it('should create a video with thumbnail', async () => {
    const channel = Channel.create({
      id: channelId,
      ownerId: UserId.create(ownerId),
      name: 'Test Channel',
      description: 'Test Description',
    });

    const createdVideo = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: videoUrl,
      thumbnailUrl,
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
    });

    fileStorageMocks.uploadFile
      .mockResolvedValueOnce({ url: videoUrl })
      .mockResolvedValueOnce({ url: thumbnailUrl });
    channelRepositoryMocks.findById.mockResolvedValue(channel);
    videoFactoryMocks.create.mockReturnValue(createdVideo);
    videosRepositoryMocks.create.mockResolvedValue(createdVideo);

    const result = await useCase.execute(
      mockVideoFile,
      {
        title: 'Test Video',
        description: 'Test Description',
        channelId,
      },
      mockThumbnailFile,
    );

    expect(result).toBe(createdVideo);
    expect(fileStorageMocks.uploadFile).toHaveBeenCalledTimes(2);
    expect(fileStorageMocks.uploadFile).toHaveBeenNthCalledWith(
      1,
      mockVideoFile,
      {
        folder: 'videos',
      },
    );
    expect(fileStorageMocks.uploadFile).toHaveBeenNthCalledWith(
      2,
      mockThumbnailFile,
      {
        folder: 'thumbnails',
      },
    );
  });

  it('should throw ChannelNotFoundException when channel does not exist', async () => {
    fileStorageMocks.uploadFile.mockResolvedValue({ url: videoUrl });
    channelRepositoryMocks.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(mockVideoFile, {
        title: 'Test Video',
        description: 'Test Description',
        channelId,
      }),
    ).rejects.toThrow(ChannelNotFoundException);

    expect(fileStorageMocks.uploadFile).toHaveBeenCalled();
    expect(channelRepositoryMocks.findById).toHaveBeenCalled();
    expect(videoFactoryMocks.create).not.toHaveBeenCalled();
    expect(videosRepositoryMocks.create).not.toHaveBeenCalled();
  });

  it('should create a video with isPublic flag', async () => {
    const channel = Channel.create({
      id: channelId,
      ownerId: UserId.create(ownerId),
      name: 'Test Channel',
      description: 'Test Description',
    });

    const createdVideo = Video.create({
      id: videoId,
      title: 'Test Video',
      description: 'Test Description',
      url: videoUrl,
      createdAt: new Date(),
      channelId: ChannelId.create(channelId),
      isPublic: true,
    });

    fileStorageMocks.uploadFile.mockResolvedValue({ url: videoUrl });
    channelRepositoryMocks.findById.mockResolvedValue(channel);
    videoFactoryMocks.create.mockReturnValue(createdVideo);
    videosRepositoryMocks.create.mockResolvedValue(createdVideo);

    const result = await useCase.execute(mockVideoFile, {
      title: 'Test Video',
      description: 'Test Description',
      channelId,
      isPublic: true,
    });

    expect(result).toBe(createdVideo);
    expect(videoFactoryMocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        isPublic: true,
      }),
    );
  });
});
