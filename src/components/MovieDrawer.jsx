import { useState, useEffect } from "react";
import { getMovieDetails, IMAGE_BASE_URL } from "../api/tmdb";
import { addToWatchlist, removeFromWatchlist } from "../api/watchlist";
import { addToWatched } from "../api/watched";
import { useMovieLists } from "../contexts/MovieListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faStar, faPlus, faCheck, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function MovieDrawer({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);

  const { isOnWatchlist, isWatched, addToWatchlistContext, removeFromWatchlistContext, addToWatchedContext } = useMovieLists();

  const onWatchlist = isOnWatchlist(movie.id || movie.tmdb_id);
  const watched = isWatched(movie.id || movie.tmdb_id);

  useEffect(() => {
    setLoading(true);
    setDetails(null);
    setError(null);

    getMovieDetails(movie.id || movie.tmdb_id)
      .then((res) => setDetails(res.data))
      .catch(() => setError("Failed to load movie details. Please try again."))
      .finally(() => setLoading(false));
  }, [movie.id, movie.tmdb_id]);

  const handleAddToWatchlist = async () => {
    setWorking(true);
    try {
      const res = await addToWatchlist({
        tmdb_id: movie.id || movie.tmdb_id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
      addToWatchlistContext(res.data);
    } catch (err) {
      if (err.response?.status !== 409) {
        setError("Failed to add to watchlist.");
      }
    } finally {
      setWorking(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    setWorking(true);
    try {
      await removeFromWatchlist(movie.id || movie.tmdb_id);
      removeFromWatchlistContext(movie.id || movie.tmdb_id);
    } catch {
      setError("Failed to remove from watchlist.");
    } finally {
      setWorking(false);
    }
  };

  const handleAddToWatched = async () => {
    setWorking(true);
    try {
      const res = await addToWatched({
        tmdb_id: movie.id || movie.tmdb_id,
        title: movie.title,
        poster_path: movie.poster_path,
        watched_date: new Date().toISOString().split("T")[0],
      });
      addToWatchedContext(res.data);
    } catch (err) {
      if (err.response?.status !== 409) {
        setError("Failed to mark as watched.");
      }
    } finally {
      setWorking(false);
    }
  };

  const trailer = details?.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const cast = details?.credits?.cast?.slice(0, 6) || [];
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} className="flex-1 bg-black/50 backdrop-blur-sm" />

      <div className="w-full max-w-lg bg-surface shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="font-bold text-text text-lg leading-tight pr-4">{movie.title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-brand transition-colors shrink-0 cursor-pointer">
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </div>

        {/* Error banner */}
        {error && <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        {loading && (
          <div className="flex-1 flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-brand" />
          </div>
        )}

        {details && (
          <div className="flex-1">
            {/* Poster and info */}
            <div className="flex gap-4 p-4">
              {posterUrl && <img src={posterUrl} alt={movie.title} className="w-28 rounded-lg shrink-0 shadow-md" />}
              <div className="flex flex-col gap-1.5">
                {details.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <FontAwesomeIcon icon={faStar} size="sm" />
                    <span className="font-semibold">{details.vote_average.toFixed(1)}</span>
                    <span className="text-text-muted text-xs">({details.vote_count.toLocaleString()} votes)</span>
                  </div>
                )}
                <p className="text-text-muted text-sm">
                  {details.release_date?.split("-")[0]}
                  {details.runtime ? ` · ${details.runtime} min` : ""}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {details.genres?.map((g) => (
                    <span key={g.id} className="bg-surface-alt border border-border text-text-muted text-xs px-2.5 py-0.5 rounded-full">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 px-4 pb-4">
              {watched ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  <FontAwesomeIcon icon={faCheck} />
                  Already Watched
                </div>
              ) : (
                <>
                  <button
                    onClick={onWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                    disabled={working}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      onWatchlist ? "bg-brand text-white hover:bg-brand-dark" : "bg-surface-alt border border-border text-text hover:border-brand hover:text-brand"
                    } disabled:opacity-60`}
                  >
                    <FontAwesomeIcon icon={working ? faSpinner : onWatchlist ? faTrash : faPlus} spin={working} />
                    {onWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  </button>

                  <button
                    onClick={handleAddToWatched}
                    disabled={working}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-dark disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={working ? faSpinner : faCheck} spin={working} />
                    Mark as Watched
                  </button>
                </>
              )}
            </div>

            {/* Overview */}
            {details.overview && (
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-text mb-2">Overview</h3>
                <p className="text-text-muted text-sm leading-relaxed">{details.overview}</p>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-text mb-2">Trailer</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe src={`https://www.youtube.com/embed/${trailer.key}`} title="Trailer" allowFullScreen className="w-full h-full" />
                </div>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="px-4 pb-6">
                <h3 className="font-semibold text-text mb-3">Cast</h3>
                <div className="grid grid-cols-3 gap-3">
                  {cast.map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-alt mb-1.5">
                        {person.profile_path ? (
                          <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted text-2xl">👤</div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-text leading-tight">{person.name}</p>
                      <p className="text-xs text-text-muted leading-tight">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
