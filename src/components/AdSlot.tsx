import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useVideoUrl } from "../lib/videoStorage";
import { useAds } from "../store/AdsContext";
import type { Ad } from "../store/AdsContext";

type Props = {
  label?: string;
  className?: string;
};

function currentSection(pathname: string): string | undefined {
  if (pathname === "/") return "home";
  if (pathname === "/news") return "news";
  if (pathname.startsWith("/category/")) {
    return decodeURIComponent(pathname.split("/")[2] ?? "");
  }
  return undefined;
}

function pickIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function AdCreative({ ad, label }: { ad: Ad; label: string }) {
  const media = ad.media;

  if (media?.type === "image") {
    const img = (
      <img
        className="ad__media"
        src={media.url}
        alt={ad.headline}
        loading="lazy"
      />
    );
    return (
      <a
        className="ad__link"
        href={ad.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (!ad.url) e.preventDefault();
        }}
        title={ad.headline}
      >
        {img}
        <span className="ad__label">{label}</span>
      </a>
    );
  }

  if (media?.type === "video") {
    return <AdVideo ad={ad} label={label} />;
  }

  return (
    <a
      className="ad__creative ad__creative--text"
      href={ad.url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (!ad.url) e.preventDefault();
      }}
    >
      <span className="ad__headline">{ad.headline}</span>
      <span className="ad__cta">{ad.url ? "Learn more →" : "Sponsored"}</span>
      <span className="ad__label">{label}</span>
    </a>
  );
}

function AdVideo({ ad, label }: { ad: Ad; label: string }) {
  const src = useVideoUrl(ad.media?.type === "video" ? ad.media.url : "");

  return (
    <a
      className="ad__link"
      href={ad.url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (!ad.url) e.preventDefault();
      }}
      title={ad.headline}
    >
      {src ? (
        <video
          className="ad__media"
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <span className="ad__creative ad__creative--text">
          <span className="ad__headline">{ad.headline}</span>
        </span>
      )}
      <span className="ad__label">{label}</span>
    </a>
  );
}

export default function AdSlot({
  label = "Advertisement",
  className = "",
}: Props) {
  const { ads } = useAds();
  const location = useLocation();
  const section = currentSection(location.pathname);

  const matching = ads.filter(
    (ad) => !ad.target || !section || ad.target === section,
  );
  const pool = matching.length > 0 ? matching : ads;
  const [index] = useState(() =>
    pool.length > 0 ? pickIndex(pool.length) : 0,
  );
  const ad = pool.length > 0 ? pool[index % pool.length] : undefined;

  return (
    <div className={`ad ${className}${ad ? " ad--creative" : ""}`} role="note">
      {ad ? <AdCreative ad={ad} label={label} /> : <span>{label}</span>}
    </div>
  );
}
