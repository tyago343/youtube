import { useGetAllVideosQuery } from "../model/video.api";
import VideoCard from "./video-card.component";
export default function VideosGrid() {
  const { data: videos, isLoading } = useGetAllVideosQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!videos) return <div>No videos found</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
