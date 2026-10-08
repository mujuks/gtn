import { Link } from "react-router-dom";
import { useNews } from "../store/NewsContext";
import StoryRow from "./StoryRow";

type Props = {
  query: string;
};

export default function SearchResults({ query }: Props) {
  const { stories } = useNews();
  const term = query.trim().toLowerCase();
  const results = stories
    .filter(
      (story) =>
        story.title.toLowerCase().includes(term) ||
        story.category.toLowerCase().includes(term) ||
        story.excerpt?.toLowerCase().includes(term) ||
        story.author?.toLowerCase().includes(term),
    )
    .slice(0, 8);

  return (
    <div className="search-results">
      <div className="container">
        <div className="search-results__head">
          <h2>
            {results.length} result{results.length === 1 ? "" : "s"} for “
            {query.trim()}”
          </h2>
          <span className="search-results__hint">Press Escape to close</span>
        </div>
        {results.length > 0 ? (
          <>
            <div className="search-results__list">
              {results.map((story) => (
                <StoryRow key={story.id} story={story} />
              ))}
            </div>
            <Link
              className="search-results__all"
              to={`/news?q=${encodeURIComponent(query.trim())}`}
            >
              View all {results.length} results on the news page
            </Link>
          </>
        ) : (
          <p className="search-results__empty">
            Nothing matched your search. Try a section name like “Politics” or
            “Sports”.
          </p>
        )}
      </div>
    </div>
  );
}
