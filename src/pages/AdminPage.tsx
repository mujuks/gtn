import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import { CATEGORIES, slugify } from "../data/categories";
import { mediaError, VIDEO_ACCEPT, VIDEO_MAX_MB } from "../data/media";
import type { StoryMedia } from "../data/media";
import type { Badge, Placement } from "../data/news";
import { storeVideo, videoKeyToUrl } from "../lib/videoStorage";
import { useAds } from "../store/AdsContext";
import type { AdMedia } from "../store/AdsContext";
import { useAuth } from "../store/AuthContext";
import { useNews } from "../store/NewsContext";

const BADGES: (Badge | "")[] = ["", "live", "video", "analysis", "exclusive"];

type MediaKind = "none" | "image" | "video" | "youtube" | "tiktok";
type AdKind = "text" | "image" | "video";

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const { stories, customStories, deletedIds, addStory, deleteStory } =
    useNews();
  const { ads, addAd, deleteAd } = useAds();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [author, setAuthor] = useState("");
  const [badge, setBadge] = useState<Badge | "">("");
  const [mediaKind, setMediaKind] = useState<MediaKind>("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [imageData, setImageData] = useState("");
  const [videoName, setVideoName] = useState("");
  const [mediaNote, setMediaNote] = useState("");
  const [placement, setPlacement] = useState<Placement | "">("");
  const [flash, setFlash] = useState("");
  const [query, setQuery] = useState("");

  const [adHeadline, setAdHeadline] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [adKind, setAdKind] = useState<AdKind>("text");
  const [adImageData, setAdImageData] = useState("");
  const [adVideoUrl, setAdVideoUrl] = useState("");
  const [adVideoName, setAdVideoName] = useState("");
  const [adMediaNote, setAdMediaNote] = useState("");

  if (!user) {
    return (
      <main className="container main">
        <div className="cat-head">
          <h1>News Manager</h1>
          <span>Sign in to add, publish and remove stories</span>
        </div>
        <AuthPanel />
      </main>
    );
  }

  const term = query.trim().toLowerCase();
  const visible = stories.filter(
    (story) =>
      !term ||
      story.title.toLowerCase().includes(term) ||
      story.category.toLowerCase().includes(term),
  );

  const isUrlKind = mediaKind === "youtube" || mediaKind === "tiktok";
  const urlError =
    isUrlKind && mediaUrl.trim() ? mediaError(mediaUrl, mediaKind) : null;

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMediaNote("Please choose an image file (JPG, PNG, GIF or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setMediaNote("");
    };
    reader.readAsDataURL(file);
  }

  async function onVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("video/")) {
      setMediaNote("Please choose a video file (MP4, WebM, OGG or MOV).");
      return;
    }
    if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
      setMediaNote(
        `That video is too large. Keep it under ${VIDEO_MAX_MB} MB.`,
      );
      return;
    }
    try {
      const key = await storeVideo(file);
      setMediaUrl(videoKeyToUrl(key));
      setVideoName(file.name);
      setMediaNote("");
    } catch {
      setMediaNote(
        "Could not store that video in this browser. Try a smaller file.",
      );
    }
  }

  function resetForm() {
    setTitle("");
    setExcerpt("");
    setAuthor("");
    setBadge("");
    setMediaKind("none");
    setMediaUrl("");
    setImageData("");
    setVideoName("");
    setMediaNote("");
    setPlacement("");
  }

  function buildMedia(): StoryMedia | null {
    if (mediaKind === "image") {
      if (!imageData) {
        setFlash("Choose a picture to attach, or set Media to None.");
        return null;
      }
      return { type: "image", url: imageData };
    }
    if (mediaKind === "video") {
      if (!mediaUrl) {
        setFlash("Upload a video file to attach, or set Media to None.");
        return null;
      }
      return { type: "video", url: mediaUrl };
    }
    if (isUrlKind) {
      const error = mediaError(mediaUrl, mediaKind);
      if (error) {
        setFlash(error);
        return null;
      }
      return { type: mediaKind, url: mediaUrl.trim() };
    }
    return null;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setFlash("Please enter a news title.");
      return;
    }
    const media = buildMedia();
    if (!media && mediaKind !== "none") return;

    addStory({
      title,
      excerpt,
      category,
      author,
      badge: badge || undefined,
      media: media ?? undefined,
      placement: placement || undefined,
    });
    setFlash(`Published to ${category}. It now appears across the site.`);
    resetForm();
  }

  function onDelete(id: string) {
    deleteStory(id);
    setFlash("Story removed from the site.");
  }

  function onAdImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAdMediaNote("Please choose an image file (JPG, PNG, GIF or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAdImageData(reader.result as string);
      setAdMediaNote("");
    };
    reader.readAsDataURL(file);
  }

  async function onAdVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("video/")) {
      setAdMediaNote("Please choose a video file (MP4, WebM, OGG or MOV).");
      return;
    }
    if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
      setAdMediaNote(
        `That video is too large. Keep it under ${VIDEO_MAX_MB} MB.`,
      );
      return;
    }
    try {
      const key = await storeVideo(file);
      setAdVideoUrl(videoKeyToUrl(key));
      setAdVideoName(file.name);
      setAdMediaNote("");
    } catch {
      setAdMediaNote(
        "Could not store that video in this browser. Try a smaller file.",
      );
    }
  }

  function onSubmitAd(event: FormEvent) {
    event.preventDefault();
    if (!adHeadline.trim()) {
      setFlash("Please enter an ad headline.");
      return;
    }
    let media: AdMedia | undefined;
    if (adKind === "image") {
      if (!adImageData) {
        setFlash("Choose a photo for the ad, or switch the type to Text.");
        return;
      }
      media = { type: "image", url: adImageData };
    } else if (adKind === "video") {
      if (!adVideoUrl) {
        setFlash("Upload a video for the ad, or switch the type to Text.");
        return;
      }
      media = { type: "video", url: adVideoUrl };
    }
    addAd({ headline: adHeadline, url: adUrl, media });
    setFlash("Ad published. It appears in the site's ad slots.");
    setAdHeadline("");
    setAdUrl("");
    setAdKind("text");
    setAdImageData("");
    setAdVideoUrl("");
    setAdVideoName("");
    setAdMediaNote("");
  }

  return (
    <main className="container main">
      <div className="cat-head cat-head--split">
        <div>
          <h1>News Manager</h1>
          <span>Signed in as {user}. Add, publish and remove stories</span>
        </div>
        <button className="auth__signout" type="button" onClick={signOut}>
          Sign Out
        </button>
      </div>

      <div className="chips">
        {CATEGORIES.map((cat) => {
          const count = stories.filter(
            (story) => story.category === cat,
          ).length;
          return (
            <Link
              className="chip"
              key={cat}
              to={`/category/${slugify(cat)}`}
              title={`View ${cat} stories`}
            >
              <span>{cat}</span>
              <b>{count}</b>
            </Link>
          );
        })}
      </div>

      {flash && <p className="flash">{flash}</p>}

      <div className="admin">
        <section className="admin__panel" aria-label="Add story">
          <h2>Add a story</h2>
          <form className="form" onSubmit={onSubmit}>
            <label>
              <span>Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Headline of the story"
                required
              />
            </label>
            <label>
              <span>Excerpt (optional)</span>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown on the story page"
                rows={3}
              />
            </label>
            <div className="admin__row">
              <label>
                <span>Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Badge (optional)</span>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as Badge | "")}
                >
                  {BADGES.map((value) => (
                    <option key={value || "none"} value={value}>
                      {value ? value : "None"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              <span>Show on</span>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as Placement | "")}
              >
                <option value="">Everywhere</option>
                <option value="for-you">For You page only</option>
                <option value="news">News &amp; other pages only</option>
              </select>
            </label>
            <p className="form__hint">
              For You = home feed; other pages = News and category sections.
            </p>
            <label>
              <span>Author</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="GTN Newsroom"
              />
            </label>

            <fieldset className="form__fieldset">
              <legend>Media</legend>
              <label>
                <span>Attach</span>
                <select
                  value={mediaKind}
                  onChange={(e) => setMediaKind(e.target.value as MediaKind)}
                >
                  <option value="none">None</option>
                  <option value="image">Picture</option>
                  <option value="video">Upload video</option>
                  <option value="youtube">YouTube link</option>
                  <option value="tiktok">TikTok link</option>
                </select>
              </label>

              {mediaKind === "image" && (
                <>
                  <input
                    className="form__file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    aria-label="Choose a picture"
                  />
                  {imageData ? (
                    <img
                      className="form__preview"
                      src={imageData}
                      alt="Selected picture preview"
                    />
                  ) : (
                    <p className="form__hint">
                      Upload a picture file to feature on the story.
                    </p>
                  )}
                  {mediaNote && (
                    <p className="form__hint form__hint--error">{mediaNote}</p>
                  )}
                </>
              )}

              {mediaKind === "video" && (
                <>
                  <input
                    className="form__file"
                    type="file"
                    accept={VIDEO_ACCEPT}
                    onChange={onVideoChange}
                    aria-label="Upload a video file"
                  />
                  {videoName ? (
                    <>
                      <p className="form__hint form__hint--ok">
                        Ready: {videoName}
                      </p>
                      <p className="form__hint">
                        The video is stored on this device and will play on the
                        story page.
                      </p>
                    </>
                  ) : (
                    <p className="form__hint">
                      Upload an MP4 or WebM file (under {VIDEO_MAX_MB} MB) to
                      feature on the story.
                    </p>
                  )}
                  {mediaNote && (
                    <p className="form__hint form__hint--error">{mediaNote}</p>
                  )}
                </>
              )}

              {isUrlKind && (
                <>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={
                      mediaKind === "youtube"
                        ? "https://www.youtube.com/watch?v=…"
                        : "https://www.tiktok.com/@user/video/…"
                    }
                  />
                  {mediaUrl.trim() ? (
                    <p
                      className={
                        urlError
                          ? "form__hint form__hint--error"
                          : "form__hint form__hint--ok"
                      }
                    >
                      {urlError ??
                        "Link looks valid — it will play on the story page."}
                    </p>
                  ) : (
                    <p className="form__hint">
                      Paste a {mediaKind === "youtube" ? "YouTube" : "TikTok"}{" "}
                      link to embed the video on the story.
                    </p>
                  )}
                </>
              )}
            </fieldset>

            <button className="btn" type="submit">
              Publish story
            </button>
          </form>
        </section>

        <section className="admin__panel" aria-label="Manage stories">
          <h2>All stories</h2>
          <label className="form__search">
            <span>Filter</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or category"
            />
          </label>
          <p className="admin__count">
            Showing {visible.length} of {stories.length} stories
          </p>
          <ul className="admin__list">
            {visible.map((story) => (
              <li className="admin__item" key={story.id}>
                <div>
                  <Link className="admin__item-title" to={`/story/${story.id}`}>
                    {story.title}
                  </Link>
                  <span className="admin__item-meta">
                    {story.category} · {story.time}
                    {story.media && (
                      <em className="admin__mine">
                        {" "}
                        ·{" "}
                        {story.media.type === "image"
                          ? "picture"
                          : story.media.type}
                      </em>
                    )}
                    {story.placement === "for-you" && (
                      <em className="admin__mine"> · For You</em>
                    )}
                    {story.placement === "news" && (
                      <em className="admin__mine"> · News</em>
                    )}
                    {customStories.some((item) => item.id === story.id) && (
                      <em className="admin__mine"> yours</em>
                    )}
                  </span>
                </div>
                <button
                  className="admin__delete"
                  type="button"
                  onClick={() => onDelete(story.id)}
                  aria-label={`Delete ${story.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {deletedIds.length > 0 && (
            <p className="admin__note">
              Deleted stories stay removed on this device only.
            </p>
          )}
        </section>
      </div>

      <section
        className="admin__panel admin__panel--full"
        aria-label="Manage ads"
      >
        <h2>Manage Ads</h2>
        <form className="form" onSubmit={onSubmitAd}>
          <div className="admin__row">
            <label>
              <span>Ad headline</span>
              <input
                type="text"
                value={adHeadline}
                onChange={(e) => setAdHeadline(e.target.value)}
                placeholder="e.g. GTN Radio — now on FM 96.1"
                required
              />
            </label>
            <label>
              <span>Destination URL (optional)</span>
              <input
                type="text"
                value={adUrl}
                onChange={(e) => setAdUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </label>
          </div>
          <label>
            <span>Ad type</span>
            <select
              value={adKind}
              onChange={(e) => setAdKind(e.target.value as AdKind)}
            >
              <option value="text">Text link</option>
              <option value="image">Photo</option>
              <option value="video">Video</option>
            </select>
          </label>

          {adKind === "image" && (
            <>
              <input
                className="form__file"
                type="file"
                accept="image/*"
                onChange={onAdImageChange}
                aria-label="Choose an ad photo"
              />
              {adImageData ? (
                <img
                  className="form__preview"
                  src={adImageData}
                  alt="Ad photo preview"
                />
              ) : (
                <p className="form__hint">
                  Upload a photo to show as the ad banner.
                </p>
              )}
              {adMediaNote && (
                <p className="form__hint form__hint--error">{adMediaNote}</p>
              )}
            </>
          )}

          {adKind === "video" && (
            <>
              <input
                className="form__file"
                type="file"
                accept={VIDEO_ACCEPT}
                onChange={onAdVideoChange}
                aria-label="Upload an ad video"
              />
              {adVideoName ? (
                <p className="form__hint form__hint--ok">
                  Ready: {adVideoName}
                </p>
              ) : (
                <p className="form__hint">
                  Upload a short MP4 or WebM clip (under {VIDEO_MAX_MB} MB).
                </p>
              )}
              {adMediaNote && (
                <p className="form__hint form__hint--error">{adMediaNote}</p>
              )}
            </>
          )}

          <button className="btn" type="submit">
            Publish ad
          </button>
        </form>

        {ads.length > 0 ? (
          <>
            <p className="admin__count">
              {ads.length} ad{ads.length === 1 ? "" : "s"} live
            </p>
            <ul className="admin__list">
              {ads.map((ad) => (
                <li className="admin__item" key={ad.id}>
                  <div>
                    <span className="admin__item-title">{ad.headline}</span>
                    <span className="admin__item-meta">
                      {ad.media?.type === "image"
                        ? "Photo"
                        : ad.media?.type === "video"
                          ? "Video"
                          : "Text"}
                      {ad.url && <> · {ad.url}</>}
                    </span>
                  </div>
                  <button
                    className="admin__delete"
                    type="button"
                    onClick={() => deleteAd(ad.id)}
                    aria-label={`Delete ad ${ad.headline}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="admin__note">
            No ads yet. Add text, photo or video ads — they will appear in the
            site's ad slots.
          </p>
        )}
      </section>
    </main>
  );
}
