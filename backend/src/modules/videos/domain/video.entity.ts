import { ChannelId } from 'src/modules/channels/domain/vo/channel-id.vo';
import { VideoId } from './vo/video-id.vo';
import { VideoVisibility } from './vo/video-visibility.vo';

export class Video {
  public constructor({
    id,
    title,
    description,
    url,
    thumbnailUrl,
    channelId,
    createdAt,
    views,
    likes,
    dislikes,
    visibility,
    updatedAt,
    published,
  }: {
    id: VideoId;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    channelId: ChannelId;
    createdAt: Date;
    views: number;
    likes: number;
    dislikes: number;
    visibility: VideoVisibility;
    updatedAt?: Date;
    published?: Date;
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
    this.channelId = channelId;
    this.createdAt = createdAt;
    this.views = views;
    this.likes = likes;
    this.dislikes = dislikes;
    this.visibility = visibility;
    this.updatedAt = updatedAt;
    this.published = published;
  }

  public readonly id: VideoId;
  public title: string;
  public description: string;
  public url: string;
  public thumbnailUrl: string;
  public readonly channelId: ChannelId;
  public readonly createdAt: Date;
  public views: number;
  public likes: number;
  public dislikes: number;
  public visibility: VideoVisibility;
  public updatedAt?: Date;
  public published?: Date;
  static create({
    id,
    title,
    description,
    url,
    thumbnailUrl = 'no-thumbnail.png',
    createdAt = new Date(),
    channelId,
    visibility = VideoVisibility.PRIVATE,
  }: {
    id: string;
    title: string;
    description: string;
    url: string;
    createdAt: Date;
    channelId: ChannelId;
    thumbnailUrl?: string;
    visibility?: VideoVisibility;
  }) {
    const views = 0;
    const likes = 0;
    const dislikes = 0;
    return new Video({
      id: VideoId.create(id),
      title,
      description,
      url,
      thumbnailUrl,
      channelId,
      createdAt,
      views,
      likes,
      dislikes,
      visibility,
    });
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
    visibility,
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
    visibility: string;
    updatedAt?: Date;
    published?: Date;
  }) {
    return new Video({
      id: VideoId.create(id),
      title,
      description,
      url,
      thumbnailUrl,
      channelId,
      createdAt,
      views,
      likes,
      dislikes,
      visibility: VideoVisibility.fromString(visibility),
      updatedAt,
      published,
    });
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
      visibility: this.visibility.value,
      published: this.published,
    };
  }
}
