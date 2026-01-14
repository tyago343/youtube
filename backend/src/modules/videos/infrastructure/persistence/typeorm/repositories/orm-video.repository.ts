import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoSchema } from '../entities/video.schema';
import {
  VideosRepository,
  VideoWithChannel,
} from 'src/modules/videos/application/ports/videos.repository';
import { Video } from 'src/modules/videos/domain/video.entity';
import { VideoMapper } from '../mappers/video.mapper';

@Injectable()
export class OrmVideoRepository extends VideosRepository {
  constructor(
    @InjectRepository(VideoSchema)
    private readonly videoRepository: Repository<VideoSchema>,
  ) {
    super();
  }
  async create(video: Video): Promise<Video> {
    const schema = VideoMapper.toPersistence(video);
    const createdVideo = this.videoRepository.create(schema);
    await this.videoRepository.save(createdVideo);
    return VideoMapper.toDomain(createdVideo);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(video: Video): Promise<Video> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Video | null> {
    const schema = await this.videoRepository.findOne({
      where: { id },
    });
    return schema ? VideoMapper.toDomain(schema) : null;
  }
  async findAll(): Promise<Video[]> {
    const schemas = await this.videoRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return schemas.map((schema) => VideoMapper.toDomain(schema));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findByIdWithChannel(id: string): Promise<VideoWithChannel | null> {
    const schema = await this.videoRepository.findOne({
      where: { id },
      relations: ['channel'],
    });
    return schema ? VideoMapper.toDomainWithChannel(schema) : null;
  }

  async findAllWithChannel(): Promise<VideoWithChannel[]> {
    const schemas = await this.videoRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['channel'],
    });
    return schemas.map((schema) => VideoMapper.toDomainWithChannel(schema));
  }
}
