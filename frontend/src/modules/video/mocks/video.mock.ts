import type { Video } from "@video/schemas/video.schema";

export const videoMock: Video = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "My first video",
  description: "This is a description of my first video",
  url: "https://example.com/video.mp4",
  thumbnailUrl: "https://example.com/thumbnail.png",
  createdAt: new Date("2021-01-01T00:00:00.000Z"),
  updatedAt: new Date("2021-01-01T00:00:00.000Z"),
  channelId: "123e4567-e89b-12d3-a456-426614174000",
  channel: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe's Channel",
    avatarUrl: "https://storage.example.com/avatars/user123.jpg",
  },
  views: 100,
  likes: 100,
  dislikes: 100,
  isPublic: true,
  published: new Date("2021-01-01T00:00:00.000Z"),
};
