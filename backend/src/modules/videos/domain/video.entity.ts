import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { VideoId } from './vo/video-id.vo';

export class Video {
  public constructor(
    public readonly id: VideoId,
    public title: string,
    public description: string,
    public url: string,
    public thumbnailUrl: string,
    public readonly channelId: ChannelId,
    public readonly createdAt: Date,
    public views: number,
    public likes: number,
    public dislikes: number,
    public isPublic: boolean,
    public updatedAt?: Date,
    public published?: Date,
  ) {}
  static create({
    id,
    title,
    description,
    url,
    thumbnailUrl = 'no-thumbnail.png',
    createdAt = new Date(),
    channelId,
    isPublic = false,
  }: {
    id: string;
    title: string;
    description: string;
    url: string;
    createdAt: Date;
    channelId: ChannelId;
    thumbnailUrl?: string;
    isPublic?: boolean;
  }) {
    const views = 0;
    const likes = 0;
    const dislikes = 0;
    return new Video(
      VideoId.create(id),
      title,
      description,
      url,
      thumbnailUrl,
      channelId,
      createdAt,
      views,
      likes,
      dislikes,
      isPublic,
    );
  }

  static fromPersistence({
    id,
    title,
    description,
    url,
    thumbnailUrl,
    createdAt,
    updatedAt,
    channelId,
    views,
    likes,
    dislikes,
    isPublic,
    published,
  }: {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    createdAt: Date;
    channelId: ChannelId;
    views: number;
    likes: number;
    dislikes: number;
    isPublic: boolean;
    updatedAt?: Date;
    published?: Date;
  }) {
    return new Video(
      VideoId.create(id),
      title,
      description,
      url,
      thumbnailUrl,
      channelId,
      createdAt,
      views,
      likes,
      dislikes,
      isPublic,
      updatedAt,
      published,
    );
  }
  toPrimitives() {
    return {
      id: this.id.value,
      title: this.title,
      description: this.description,
      url: this.url,
      thumbnailUrl: this.thumbnailUrl,
      channelId: this.channelId.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      views: this.views,
      likes: this.likes,
      dislikes: this.dislikes,
      isPublic: this.isPublic,
      published: this.published,
    };
  }
}
