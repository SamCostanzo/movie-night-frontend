import { IMAGE_BASE_URL } from "../api/tmdb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null;

  return (
    <div onClick={onClick} className="cursor-pointer group rounded-xl overflow-hidden bg-surface border border-border hover:border-brand hover:shadow-lg transition-all duration-200">
      {/* Poster */}
      <div className="aspect-[2/3] bg-surface-alt overflow-hidden">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-text text-sm leading-tight line-clamp-2">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-text-muted">{movie.release_date?.split("-")[0]}</span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <FontAwesomeIcon icon={faStar} size="xs" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
