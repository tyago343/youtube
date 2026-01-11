import { AspectRatio } from "@shared/ui/aspect-ratio";
import type { Video } from "../schemas/video.schema";

interface VideoPlayerProps {
  video: Video;
}

function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
      <video src={video.url} controls />
    </AspectRatio>
  );
}

export default VideoPlayer;
