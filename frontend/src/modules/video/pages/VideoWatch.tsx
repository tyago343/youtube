import { useParams } from "react-router";
import { useGetVideoQuery } from "../model/video.api";
import VideoPlayer from "../components/video-player.component";
import VideoInfo from "../components/video-info.component";

function VideoWatch() {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video } = useGetVideoQuery(videoId ?? "");

  if (!video) {
    return null;
  }

  return (
    <div>
      <VideoPlayer video={video} />
      <VideoInfo video={video} />
    </div>
  );
}

export default VideoWatch;
