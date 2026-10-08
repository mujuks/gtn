import type { Badge as BadgeType } from "../data/news";

const labels: Record<BadgeType, string> = {
  live: "Live",
  video: "Video",
  analysis: "Analysis",
  exclusive: "Exclusive",
};

export default function Badge({ type }: { type: BadgeType }) {
  return <span className={`badge badge--${type}`}>{labels[type]}</span>;
}
