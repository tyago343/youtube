import { cn } from "@shared/lib/utils";
import { useSidebarOptional } from "@/shared/components/sidebar/use-sidebar.hook";
import { useGetAllVideosQuery } from "../model/video.api";
import VideoCard from "./video-card.component";

export default function VideosGrid() {
  const { data: videos = [] } = useGetAllVideosQuery();
  const sidebar = useSidebarOptional();
  const isCollapsed = sidebar?.isCollapsed ?? false;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        isCollapsed ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
