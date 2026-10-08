import type { CSSProperties } from "react";
import type { Story } from "../data/news";
import { youtubeThumb } from "../data/media";
import StoryImage from "./StoryImage";

type Props = {
  story: Story;
  ratio?: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
      <path fill="currentColor" d="M8 5.2v13.6L19 12 8 5.2Z" />
    </svg>
  );
}

export default function StoryMedia({ story, ratio = "16 / 9" }: Props) {
  const media = story.media;

  if (!media) {
    return <StoryImage seed={story.seed} ratio={ratio} />;
  }

  const style: CSSProperties = { aspectRatio: ratio };

  if (media.type === "image") {
    return (
      <img
        className="story-media story-media--img"
        src={media.url}
        alt=""
        loading="lazy"
        style={style}
      />
    );
  }

  if (media.type === "youtube") {
    return (
      <div
        className="story-media story-media--video"
        style={style}
        aria-hidden="true"
      >
        <img src={youtubeThumb(media.url)} alt="" loading="lazy" />
        <span className="story-media__play">
          <PlayIcon />
        </span>
      </div>
    );
  }

  return (
    <div
      className="story-media story-media--video story-media--tiktok"
      style={style}
      aria-hidden="true"
    >
      <span className="story-media__tt" aria-hidden="true">
        ♪ TikTok
      </span>
      <span className="story-media__play story-media__play--tt">
        <PlayIcon />
      </span>
    </div>
  );
}
