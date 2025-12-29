import { Video } from '../../domain/video.entity';

export abstract class VideosRepository {
  abstract create(video: Video): Promise<Video>;
  abstract update(video: Video): Promise<Video>;
  abstract findById(id: string): Promise<Video | null>;
  abstract findAll(): Promise<Video[]>;
  abstract delete(id: string): Promise<void>;
}
