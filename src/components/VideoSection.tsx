import { useRef, useState } from "react";
import { channelUrl, thumbUrl, videos, watchUrl } from "../data/videos";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path fill="currentColor" d="M8 5.2v13.6L19 12 8 5.2Z" />
    </svg>
  );
}

export default function VideoSection() {
  const [activeId, setActiveId] = useState(videos[0].id);
  const [playing, setPlaying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const active = videos.find((video) => video.id === activeId) ?? videos[0];
  const others = videos.filter((video) => video.id !== active.id);
  const upNext = others.slice(0, 7);
  const archive = others.slice(7);
  const visibleArchive = showAll ? archive : archive.slice(0, 8);

  function select(id: string) {
    setActiveId(id);
    setPlaying(false);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="tv section" id="tv">
      <div className="section__head section__head--dark">
        <h2 className="section__title">GTN TV</h2>
        <a
          className="section__link"
          href={channelUrl}
          target="_blank"
          rel="noreferrer"
        >
          All videos on YouTube
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      <div className="tv__layout">
        <div className="tv__player" ref={playerRef}>
          <div className="tv__frame">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="tv__poster"
                onClick={() => setPlaying(true)}
                aria-label={`Play: ${active.title}`}
              >
                <img src={thumbUrl(active.id)} alt="" loading="lazy" />
                <span className="tv__play">
                  <PlayIcon />
                </span>
                <span className="tv__duration">{active.duration}</span>
              </button>
            )}
          </div>
          <span className="kicker kicker--orange">Now playing</span>
          <h3 className="tv__title">{active.title}</h3>
          <p className="tv__meta">
            {active.views} views <span aria-hidden="true">·</span>{" "}
            {active.published}
            <a href={watchUrl(active.id)} target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
          </p>
        </div>

        <div className="tv__next">
          <h3 className="tv__next-title">Up next</h3>
          <div className="tv__next-list">
            {upNext.map((video) => (
              <button
                type="button"
                className="tv__thumb"
                key={video.id}
                onClick={() => select(video.id)}
              >
                <span className="tv__thumb-media">
                  <img src={thumbUrl(video.id)} alt="" loading="lazy" />
                  <span className="tv__thumb-duration">{video.duration}</span>
                </span>
                <span className="tv__thumb-body">
                  <span className="tv__thumb-title">{video.title}</span>
                  <span className="tv__thumb-meta">
                    {video.views} views · {video.published}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tv__grid">
        {visibleArchive.map((video) => (
          <button
            type="button"
            className="tvcard"
            key={video.id}
            onClick={() => select(video.id)}
          >
            <span className="tvcard__media">
              <img src={thumbUrl(video.id)} alt="" loading="lazy" />
              <span className="tv__thumb-duration">{video.duration}</span>
              <span className="tvcard__play">
                <PlayIcon />
              </span>
            </span>
            <span className="tvcard__title">{video.title}</span>
            <span className="tvcard__meta">
              {video.views} views · {video.published}
            </span>
          </button>
        ))}
      </div>

      {archive.length > 8 && (
        <button
          type="button"
          className="tv__more"
          onClick={() => setShowAll((open) => !open)}
        >
          {showAll
            ? "Show fewer videos"
            : `Show ${archive.length - 8} more videos`}
        </button>
      )}
    </section>
  );
}
