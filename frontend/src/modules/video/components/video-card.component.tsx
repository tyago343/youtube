import { AspectRatio } from "@/shared/ui/aspect-ratio";
import type { Video } from "../types/video.types";
import { useNavigate } from "react-router";

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-lg overflow-hidden cursor-pointer hover:bg-accent/50 transition-all duration-300 p-4"
      onClick={() => navigate(`/watch/${video.id}`)}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <div className="mt-4">
        <h3 className="text-lg font-bold line-clamp-2 mb-2">{video.title}</h3>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </div>
    </div>
  );
}
