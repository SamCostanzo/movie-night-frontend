import { useState, useEffect } from "react";
import { getWatched, removeFromWatched } from "../api/watched";
import { addReview, deleteReview } from "../api/reviews";
import { IMAGE_BASE_URL } from "../api/tmdb";
import MovieDrawer from "../components/MovieDrawer";
import { useAuth } from "../contexts/AuthContext";
import { useMovieLists } from "../contexts/MovieListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash, faCheckCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

export default function Watched() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useAuth();
  const { removeFromWatchedContext } = useMovieLists();
  const navigate = useNavigate();

  useEffect(() => {
    getWatched()
      .then((res) => setWatched(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (tmdbId) => {
    setRemoving(tmdbId);
    try {
      await removeFromWatched(tmdbId);
      removeFromWatchedContext(tmdbId);
      setWatched(watched.filter((m) => m.tmdb_id !== tmdbId));
    } finally {
      setRemoving(null);
    }
  };

  const handleAddReview = async (watchedId) => {
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await addReview(watchedId, reviewText);
      setWatched(
        watched.map((m) => {
          if (m.id === watchedId) {
            return { ...m, reviews: [...(m.reviews || []), res.data] };
          }
          return m;
        }),
      );
      setReviewText("");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (watchedId, reviewId) => {
    try {
      await deleteReview(reviewId);
      setWatched(
        watched.map((m) => {
          if (m.id === watchedId) {
            return { ...m, reviews: m.reviews.filter((r) => r.id !== reviewId) };
          }
          return m;
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-brand" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Watched</h1>

      {watched.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No watched movies yet"
          message="After your first movie night, mark movies as watched and leave reviews."
          action={
            <button onClick={() => navigate("/")} className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Browse Movies
            </button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {watched.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="flex gap-4 p-4">
                {/* Poster */}
                <div
                  className="w-16 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-surface-alt cursor-pointer"
                  onClick={() => setSelectedMovie({ id: item.tmdb_id, title: item.title, poster_path: item.poster_path })}
                >
                  {item.poster_path ? (
                    <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text leading-tight">{item.title}</h3>
                  <p className="text-xs text-text-muted mt-1">
                    Watched on {new Date(item.watched_date).toLocaleDateString()} · by {item.user?.username}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="text-xs text-brand hover:underline cursor-pointer">
                      {item.reviews?.length || 0} review{item.reviews?.length !== 1 ? "s" : ""} · {expandedId === item.id ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => handleRemove(item.tmdb_id)} disabled={removing === item.tmdb_id} className="text-text-muted hover:text-red-500 transition-colors self-start cursor-pointer">
                  <FontAwesomeIcon icon={removing === item.tmdb_id ? faSpinner : faTrash} spin={removing === item.tmdb_id} size="sm" />
                </button>
              </div>

              {/* Reviews section */}
              {expandedId === item.id && (
                <div className="border-t border-border px-4 py-4">
                  {item.reviews?.length > 0 ? (
                    <div className="flex flex-col gap-3 mb-4">
                      {item.reviews.map((review) => (
                        <div key={review.id} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">{review.user?.name?.charAt(0).toUpperCase()}</div>
                          <div className="flex-1 bg-surface-alt rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-text">{review.user?.username}</span>
                              {review.user_id === user?.id && (
                                <button onClick={() => handleDeleteReview(item.id, review.id)} className="text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                                  <FontAwesomeIcon icon={faTrash} size="xs" />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-text">{review.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm mb-4">No reviews yet. Be the first!</p>
                  )}

                  {/* Add review */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddReview(item.id)}
                      placeholder="Write a review..."
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-text bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <button
                      onClick={() => handleAddReview(item.id)}
                      disabled={submittingReview || !reviewText.trim()}
                      className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={submittingReview ? faSpinner : faPaperPlane} spin={submittingReview} size="sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedMovie && <MovieDrawer movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
