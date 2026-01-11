import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import Button from "@shared/ui/button/button";
import { formatRelativeTime } from "@shared/lib/time.lib";
import type { Video } from "../schemas/video.schema";

interface VideoInfoProps {
  video: Video;
}

function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={video.owner.avatarUrl}
              alt={video.owner.username}
            />
            <AvatarFallback>{video.owner.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{video.owner.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            {video.likes} <ThumbsUpIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ThumbsDownIcon className="size-4" />
          </Button>
        </div>
      </section>
      <section className="bg-muted p-4 rounded-lg">
        <div className="font-semibold text-sm mb-2">
          <span className="mr-2">{video.views} views</span>
          <span>{formatRelativeTime(video.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-500">{video.description}</p>
      </section>
    </div>
  );
}

export default VideoInfo;
