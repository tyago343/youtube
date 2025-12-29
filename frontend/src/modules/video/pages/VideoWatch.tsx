import { useParams } from "react-router";

function VideoWatch() {
  const { videoId } = useParams<{ videoId: string }>();

  return (
    <div className="p-4">
      <h1>Watching Video: {videoId}</h1>
      <p>Video player will go here</p>
    </div>
  );
}

export default VideoWatch;
