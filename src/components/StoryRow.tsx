import type { Story } from "../data/news";
import { Link } from "react-router-dom";
import Badge from "./Badge";
import StoryMedia from "./StoryMedia";

type Props = {
  story: Story;
  showImage?: boolean;
};

export default function StoryRow({ story, showImage = true }: Props) {
  return (
    <article className="row">
      {showImage && (
        <Link
          className="row__media"
          to={`/story/${story.id}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <StoryMedia story={story} ratio="4 / 3" />
        </Link>
      )}
      <div className="row__body">
        <span className="kicker">{story.category}</span>
        <h3 className="row__title">
          <Link to={`/story/${story.id}`}>{story.title}</Link>
        </h3>
        <span className="meta">
          {story.badge && <Badge type={story.badge} />}
          <time>{story.time}</time>
        </span>
      </div>
    </article>
  );
}
