import VideosGrid from "./videos-grid.component";
import { render } from "@/lib/test-utils";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { videoMock } from "@/mocks/videos/video.mock";

describe("VideosGrid", () => {
  it("should render all videos", () => {
    const videos = Array(10).fill(videoMock);
    // @ts-expect-error - component under development
    render(<VideosGrid videos={videos} />);
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(screen.getAllByRole("img")).toHaveLength(10);
  });
});
