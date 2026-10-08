/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { slugify } from "../data/categories";
import type { StoryMedia } from "../data/media";
import type { Badge, Placement, Story } from "../data/news";
import { allStories } from "../data/news";
import {
  deleteVideo,
  isStoredVideo,
  storedVideoKey,
} from "../lib/videoStorage";

const LS_CUSTOM = "gtn.custom-stories-v1";
const LS_DELETED = "gtn.deleted-stories-v1";

export type NewStoryInput = {
  title: string;
  excerpt?: string;
  category: string;
  author?: string;
  badge?: Badge;
  media?: StoryMedia;
  placement?: Placement;
};

type NewsContextValue = {
  stories: Story[];
  newsStories: Story[];
  customStories: Story[];
  deletedIds: string[];
  addStory: (input: NewStoryInput) => Story;
  deleteStory: (id: string) => void;
  getStory: (id: string) => Story | undefined;
  categoryStories: (slug: string) => Story[];
};

const NewsContext = createContext<NewsContextValue | null>(null);

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function readStories(key: string): Story[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Story[]) : [];
  } catch {
    return [];
  }
}

export function NewsProvider({ children }: { children: ReactNode }) {
  const [customStories, setCustomStories] = useState<Story[]>(() =>
    readStories(LS_CUSTOM),
  );
  const [deletedIds, setDeletedIds] = useState<string[]>(() =>
    readList(LS_DELETED),
  );

  useEffect(() => {
    try {
      localStorage.setItem(LS_CUSTOM, JSON.stringify(customStories));
    } catch {
      // Ignore storage quota errors so the session keeps working.
    }
  }, [customStories]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DELETED, JSON.stringify(deletedIds));
    } catch {
      // Ignore storage quota errors.
    }
  }, [deletedIds]);

  const stories = useMemo(() => {
    const remaining = allStories.filter(
      (story) => !deletedIds.includes(story.id),
    );
    return [...remaining, ...customStories];
  }, [deletedIds, customStories]);

  const newsStories = useMemo(
    () => stories.filter((story) => story.placement !== "for-you"),
    [stories],
  );

  function addStory(input: NewStoryInput): Story {
    const story: Story = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: input.title.trim(),
      excerpt: input.excerpt?.trim() || undefined,
      category: input.category,
      time: "Just now",
      seed: Math.floor(Math.random() * 50) + 1,
      badge: input.badge,
      author: input.author?.trim() || "GTN Newsroom",
      media: input.media,
      placement: input.placement,
    };
    setCustomStories((prev) => [story, ...prev]);
    return story;
  }

  function deleteStory(id: string) {
    const story = customStories.find((item) => item.id === id);
    if (story?.media?.type === "video" && isStoredVideo(story.media.url)) {
      deleteVideo(storedVideoKey(story.media.url)).catch(() => {});
    }
    setCustomStories((prev) => prev.filter((story) => story.id !== id));
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function getStory(id: string) {
    return stories.find((story) => story.id === id);
  }

  function categoryStories(slug: string) {
    return stories.filter(
      (story) =>
        slugify(story.category) === slug && story.placement !== "for-you",
    );
  }

  const value: NewsContextValue = {
    stories,
    newsStories,
    customStories,
    deletedIds,
    addStory,
    deleteStory,
    getStory,
    categoryStories,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used within a NewsProvider");
  return context;
}
