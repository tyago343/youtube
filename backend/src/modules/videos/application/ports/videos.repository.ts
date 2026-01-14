import { Video } from '../../domain/video.entity';
import { Channel } from 'src/modules/channels/domain/channel.entity';

export type VideoWithChannel = {
  video: Video;
  channel: Channel;
};

export abstract class VideosRepository {
  abstract create(video: Video): Promise<Video>;
  abstract update(video: Video): Promise<Video>;
  abstract findById(id: string): Promise<Video | null>;
  abstract findAll(): Promise<Video[]>;
  abstract delete(id: string): Promise<void>;

  abstract findByIdWithChannel(id: string): Promise<VideoWithChannel | null>;
  abstract findAllWithChannel(): Promise<VideoWithChannel[]>;
}
