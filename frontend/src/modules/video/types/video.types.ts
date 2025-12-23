import type { User } from "@/modules/user/types/user.type";

export type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner: User;
  views: number;
  likes: number;
  dislikes: number;
  isPublic: boolean;
  published: Date;
};
