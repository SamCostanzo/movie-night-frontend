import { useState } from "react";
import { removeFromWatchlist } from "../api/watchlist";
import { IMAGE_BASE_URL } from "../api/tmdb";
import MovieDrawer from "../components/MovieDrawer";
import { useMovieLists } from "../contexts/MovieListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash, faFilm } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import { movieGrid } from "../constants/theme";

export default function Watchlist() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [removing, setRemoving] = useState(null);
  const { watchlist, removeFromWatchlistContext } = useMovieLists();
  const navigate = useNavigate();

  const handleRemove = async (tmdbId) => {
    setRemoving(tmdbId);
    try {
      await removeFromWatchlist(tmdbId);
      removeFromWatchlistContext(tmdbId);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Watchlist</h1>

      {watchlist.length === 0 ? (
        <EmptyState
          icon="🍿"
          title="Your watchlist is empty"
          message="Browse movies and add ones you want to watch with your crew."
          action={
            <button onClick={() => navigate("/")} className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Browse Movies
            </button>
          }
        />
      ) : (
        <div className={movieGrid}>
          {watchlist.map((item) => (
            <div key={item.id} className="group rounded-xl overflow-hidden bg-surface border border-border hover:border-brand hover:shadow-lg transition-all duration-200">
              {/* Poster */}
              <div className="aspect-[2/3] bg-surface-alt overflow-hidden cursor-pointer" onClick={() => setSelectedMovie({ id: item.tmdb_id, title: item.title, poster_path: item.poster_path })}>
                {item.poster_path ? (
                  <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-medium text-text text-sm leading-tight line-clamp-2 mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Added by {item.user?.username}</span>
                  <button onClick={() => handleRemove(item.tmdb_id)} disabled={removing === item.tmdb_id} className="text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                    <FontAwesomeIcon icon={removing === item.tmdb_id ? faSpinner : faTrash} spin={removing === item.tmdb_id} size="sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && <MovieDrawer movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
