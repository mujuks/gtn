import { Link, Navigate, useParams } from "react-router-dom";
import Section from "../components/Section";
import StoryCard from "../components/StoryCard";
import StoryImage from "../components/StoryImage";
import { slugify } from "../data/categories";
import { tiktokEmbedUrl, youtubeEmbedUrl } from "../data/media";
import type { Story } from "../data/news";
import { useVideoUrl } from "../lib/videoStorage";
import { useNews } from "../store/NewsContext";

function UploadedVideo({ story }: { story: Story }) {
  const src = useVideoUrl(story.media?.type === "video" ? story.media.url : "");

  if (!src) {
    return <StoryImage seed={story.seed} ratio="16 / 9" />;
  }

  return <video src={src} controls playsInline />;
}

function renderMedia(story: Story) {
  const media = story.media;

  if (!media) {
    return <StoryImage seed={story.seed} ratio="16 / 9" />;
  }

  if (media.type === "image") {
    return <img src={media.url} alt={story.title} loading="lazy" />;
  }

  if (media.type === "video") {
    return <UploadedVideo story={story} />;
  }

  if (media.type === "youtube") {
    return (
      <iframe
        src={youtubeEmbedUrl(media.url)}
        title={story.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <iframe
      src={tiktokEmbedUrl(media.url)}
      title={story.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

export default function StoryPage() {
  const { id = "" } = useParams();
  const { getStory, categoryStories } = useNews();

  const story = getStory(id);
  if (!story) return <Navigate to="/news" replace />;

  const related = categoryStories(slugify(story.category))
    .filter((item) => item.id !== story.id)
    .slice(0, 3);

  const mediaType = story.media?.type;

  return (
    <main className="container main">
      <article className="story">
        <Link
          className="story__back"
          to={`/category/${slugify(story.category)}`}
        >
          ← Back to {story.category}
        </Link>
        <span className="kicker story__kicker">{story.category}</span>
        <h1 className="story__title">{story.title}</h1>
        <span className="story__meta">
          <span>By {story.author ?? "GTN Newsroom"}</span>
          <span aria-hidden="true">·</span>
          <time>{story.time}</time>
        </span>
        <div
          className={
            mediaType === "tiktok"
              ? "story__media story__embed story__embed--tiktok"
              : "story__media story__embed"
          }
        >
          {renderMedia(story)}
        </div>
        {story.excerpt && <p className="story__excerpt">{story.excerpt}</p>}
      </article>

      {related.length > 0 && (
        <Section
          id="related"
          title={`More ${story.category}`}
          link={`/category/${slugify(story.category)}`}
        >
          <div className="grid grid--3">
            {related.map((item) => (
              <StoryCard key={item.id} story={item} />
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
