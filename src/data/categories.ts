export const CATEGORIES: string[] = [
  "News",
  "GTN Originals",
  "Wananchi Reporting",
  "Business",
  "Sports",
  "Games",
  "Entertainment",
  "Tech",
  "Lifestyle",
  "Live Events",
  "Opinion & Blogs",
  "Shopping",
];

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToLabel(slug: string): string {
  const match = CATEGORIES.find((cat) => slugify(cat) === slug);
  if (match) return match;
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
