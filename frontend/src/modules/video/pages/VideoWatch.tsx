import { useParams } from "react-router";
import { useGetVideoQuery } from "../model/video.api";
import { AspectRatio } from "@/shared/ui/aspect-ratio";

function VideoWatch() {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video } = useGetVideoQuery(videoId ?? "");
  return (
    <div className="p-4">
      {video && (
        <AspectRatio ratio={16 / 9} className="w-4xl mx-auto">
          <video src={video.url} controls />
        </AspectRatio>
      )}
    </div>
  );
}

export default VideoWatch;
