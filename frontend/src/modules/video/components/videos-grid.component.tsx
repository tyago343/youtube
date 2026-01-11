import { useGetAllVideosQuery } from "../model/video.api";
import VideoCard from "./video-card.component";
export default function VideosGrid() {
  const { data: videos = [] } = useGetAllVideosQuery();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
