import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  deleteVideo,
  isStoredVideo,
  storedVideoKey,
} from "../lib/videoStorage";

const LS_ADS = "gtn.custom-ads-v1";

export type AdMedia =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

export type AdKind = "text" | "image" | "video";

export type Ad = {
  id: string;
  headline: string;
  url?: string;
  media?: AdMedia;
};

export type NewAdInput = {
  headline: string;
  url?: string;
  media?: AdMedia;
};

type AdsContextValue = {
  ads: Ad[];
  addAd: (input: NewAdInput) => Ad;
  deleteAd: (id: string) => void;
};

const AdsContext = createContext<AdsContextValue | null>(null);

function readAds(): Ad[] {
  try {
    const raw = localStorage.getItem(LS_ADS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Ad[]) : [];
  } catch {
    return [];
  }
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function AdsProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>(() => readAds());

  useEffect(() => {
    try {
      localStorage.setItem(LS_ADS, JSON.stringify(ads));
    } catch {
      // Ignore storage quota errors so the session keeps working.
    }
  }, [ads]);

  function addAd(input: NewAdInput): Ad {
    const ad: Ad = {
      id: `ad-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      headline: input.headline.trim(),
      url: input.url ? normalizeUrl(input.url) : undefined,
      media: input.media,
    };
    setAds((prev) => [ad, ...prev]);
    return ad;
  }

  function deleteAd(id: string) {
    const ad = ads.find((item) => item.id === id);
    if (ad?.media?.type === "video" && isStoredVideo(ad.media.url)) {
      deleteVideo(storedVideoKey(ad.media.url)).catch(() => {});
    }
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  }

  const value: AdsContextValue = { ads, addAd, deleteAd };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) throw new Error("useAds must be used within an AdsProvider");
  return context;
}
