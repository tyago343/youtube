import { AspectRatio } from "@/shared/ui/aspect-ratio";
import type { Video } from "../types/video.types";
import { useNavigate } from "react-router";

export default function VideoCard({ video }: { video: Video }) {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-lg overflow-hidden"
      onClick={() => navigate(`/watch/${video.id}`)}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="text-lg font-bold">{video.title}</h3>
        <p className="text-sm text-gray-500">{video.description}</p>
      </div>
    </div>
  );
}
