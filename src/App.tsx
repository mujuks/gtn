import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import BreakingTicker from "./components/BreakingTicker";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";
import SearchResults from "./components/SearchResults";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ForYouPage from "./pages/ForYouPage";
import NewsPage from "./pages/NewsPage";
import StoryPage from "./pages/StoryPage";
import TvPage from "./pages/TvPage";

export default function App() {
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searching = query.trim().length > 1;

  return (
    <>
      <HeaderNav query={query} onQueryChange={setQuery} />
      <BreakingTicker />
      {searching && <SearchResults query={query} />}
      <Routes>
        <Route path="/" element={<ForYouPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/tv" element={<TvPage />} />
        <Route path="/radio" element={<Navigate to="/tv" replace />} />
        <Route path="/podcasts" element={<Navigate to="/tv" replace />} />
        <Route path="/live-events" element={<Navigate to="/tv" replace />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/story/:id" element={<StoryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
