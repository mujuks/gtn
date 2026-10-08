import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Story } from "../data/news";
import AdSlot from "../components/AdSlot";
import Section from "../components/Section";
import StoryCard from "../components/StoryCard";
import StoryImage from "../components/StoryImage";
import TrendingNow from "../components/TrendingNow";
import VideoStrip from "../components/VideoStrip";
import { channelUrl } from "../data/videos";
import {
  entertainmentStories,
  homeFeed,
  leadStory,
  opinionPieces,
  topTrioStories,
} from "../data/news";
import { useNews } from "../store/NewsContext";

function feedRows(items: Story[]): Story[][] {
  const rows: Story[][] = [];
  items.forEach((story, index) => {
    if (index % 3 === 0) rows.push([]);
    rows[rows.length - 1].push(story);
  });
  return rows;
}

export default function ForYouPage() {
  const { deletedIds, customStories } = useNews();

  const trio = topTrioStories.filter((story) => !deletedIds.includes(story.id));
  const feed = [
    ...homeFeed.filter((story) => !deletedIds.includes(story.id)),
    ...customStories,
  ];

  const feedContent: ReactNode[] = [];
  feedRows(feed).forEach((row, index) => {
    feedContent.push(
      <div className="feedrow" key={`feed-${row[0].id}`}>
        {row.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>,
    );
    if (index === 1 || index === 3) {
      feedContent.push(<AdSlot key={`feed-ad-${index}`} />);
    }
  });

  return (
    <>
      <main className="container main" id="top">
        <AdSlot className="ad--top" />

        <div className="hero-cd">
          <div className="hero-cd__main">
            <article className="pin">
              <Link
                className="pin__media"
                to={`/story/${leadStory.id}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                <StoryImage seed={leadStory.seed} ratio="16 / 9" />
              </Link>
              <div className="pin__body">
                <span className="kicker">{leadStory.category}</span>
                <h1 className="pin__title">
                  <Link to={`/story/${leadStory.id}`}>{leadStory.title}</Link>
                </h1>
                <span className="pin__byline">
                  By {leadStory.author ?? "GTN Newsroom"}
                </span>
              </div>
            </article>

            <div className="toprow">
              {trio.map((story) => (
                <StoryCard key={story.id} story={story} corner="Top Stories" />
              ))}
            </div>
          </div>

          <aside className="hero-cd__side" aria-label="Trending stories">
            <AdSlot className="ad--side" />
            <TrendingNow id="trending" />
          </aside>
        </div>

        <VideoStrip />

        <div className="feedwrap" id="latest">
          <div className="feedwrap__main">{feedContent}</div>

          <aside className="feedwrap__side">
            <div className="livebox">
              <span className="livebox__dot" aria-hidden="true" />
              <div>
                <h3>GTN Live TV</h3>
                <p>
                  Rolling coverage, bulletins and press conferences — streaming
                  now.
                </p>
                <a href={channelUrl} target="_blank" rel="noreferrer">
                  Watch on YouTube
                </a>
              </div>
            </div>
            <AdSlot className="ad--side" />
          </aside>
        </div>

        <div className="more-wrap">
          <Link className="morebtn" to="/news">
            More News
          </Link>
        </div>
      </main>

      <div className="band">
        <div className="container">
          <Section
            id="entertainment"
            title="Entertainment"
            link="/category/entertainment"
          >
            <div className="grid grid--3">
              {entertainmentStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </Section>
        </div>
      </div>

      <main className="container main">
        <Section
          id="opinion"
          title="Opinion & Blogs"
          tone="blue"
          link="/category/opinion-and-blogs"
        >
          <div className="grid grid--3">
            {opinionPieces.map((story) => (
              <article className="opinion" key={story.id}>
                <span className="opinion__mark" aria-hidden="true">
                  “
                </span>
                <h3 className="opinion__title">
                  <Link to={`/story/${story.id}`}>{story.title}</Link>
                </h3>
                <span className="opinion__byline">By {story.author}</span>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}
