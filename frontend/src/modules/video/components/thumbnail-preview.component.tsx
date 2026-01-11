import { useMemo, useEffect } from "react";

function ThumbnailPreview({ file }: { file: File }) {
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  return (
    <img
      src={objectUrl}
      alt="Thumbnail preview"
      className="w-full h-80 object-cover rounded-md border border-border"
    />
  );
}
export default ThumbnailPreview;
