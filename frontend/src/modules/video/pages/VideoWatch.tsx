import { useParams } from "react-router";
import { useGetVideoQuery } from "../model/video.api";
import { AspectRatio } from "@/shared/ui/aspect-ratio";

function VideoWatch() {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video } = useGetVideoQuery(videoId ?? "");
  return (
    <div>
      {video && (
        <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
          <video src={video.url} controls />
        </AspectRatio>
      )}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{video?.title}</h1>
        <p className="text-sm text-gray-500">{video?.description}</p>
      </div>
    </div>
  );
}

export default VideoWatch;
