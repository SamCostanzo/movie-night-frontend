import { createContext, useContext, useState, useEffect } from "react";
import { getWatchlist } from "../api/watchlist";
import { getWatched } from "../api/watched";
import { useAuth } from "./AuthContext";

const MovieListContext = createContext(null);

export function MovieListProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    Promise.all([getWatchlist(), getWatched()])
      .then(([watchlistRes, watchedRes]) => {
        setWatchlist(watchlistRes.data);
        setWatched(watchedRes.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addToWatchlistContext = (movie) => {
    setWatchlist((prev) => [...prev, movie]);
  };

  const removeFromWatchlistContext = (tmdbId) => {
    setWatchlist((prev) => prev.filter((m) => m.tmdb_id !== tmdbId));
  };

  const addToWatchedContext = (movie) => {
    setWatched((prev) => [...prev, movie]);
    removeFromWatchlistContext(movie.tmdb_id);
  };

  const removeFromWatchedContext = (tmdbId) => {
    setWatched((prev) => prev.filter((m) => m.tmdb_id !== tmdbId));
  };

  const isOnWatchlist = (tmdbId) => watchlist.some((m) => m.tmdb_id === tmdbId);

  const isWatched = (tmdbId) => watched.some((m) => m.tmdb_id === tmdbId);

  return (
    <MovieListContext.Provider
      value={{
        watchlist,
        watched,
        loading,
        addToWatchlistContext,
        removeFromWatchlistContext,
        addToWatchedContext,
        removeFromWatchedContext,
        isOnWatchlist,
        isWatched,
      }}
    >
      {children}
    </MovieListContext.Provider>
  );
}

export function useMovieLists() {
  return useContext(MovieListContext);
}
