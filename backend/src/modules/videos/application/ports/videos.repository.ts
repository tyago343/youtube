import { Video } from '../../domain/video.entity';
import { User } from 'src/modules/users/domain/user.entity';

export type VideoWithOwner = {
  video: Video;
  owner: User;
};

export abstract class VideosRepository {
  abstract create(video: Video): Promise<Video>;
  abstract update(video: Video): Promise<Video>;
  abstract findById(id: string): Promise<Video | null>;
  abstract findAll(): Promise<Video[]>;
  abstract delete(id: string): Promise<void>;

  abstract findByIdWithOwner(id: string): Promise<VideoWithOwner | null>;
  abstract findAllWithOwner(): Promise<VideoWithOwner[]>;
}
