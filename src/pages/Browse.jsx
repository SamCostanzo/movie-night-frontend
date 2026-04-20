import { useState, useEffect } from "react";
import { searchMovies, getGenres, discoverMovies, IMAGE_BASE_URL } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import MovieDrawer from "../components/MovieDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import EmptyState from "../components/ui/EmptyState";
import { movieGrid } from "../constants/theme";

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load genres on mount
  useEffect(() => {
    getGenres().then((res) => setGenres(res.data.genres));
  }, []);

  // Fetch movies when query or genre changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let res;
        if (query.trim()) {
          res = await searchMovies(query);
          setMovies(res.data.results);
        } else {
          res = await discoverMovies({
            sort_by: "popularity.desc",
            with_genres: selectedGenre || undefined,
          });
          setMovies(res.data.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchMovies, 400);
    return () => clearTimeout(debounce);
  }, [query, selectedGenre]);

  return (
    <div>
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border border-border rounded-lg px-4 py-2.5 bg-surface text-text focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <SkeletonGrid count={20} />}

      {!loading && (
        <div className={movieGrid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && <EmptyState icon="🎬" title="No movies found" message="Try searching for a different title or adjusting your genre filter." />}

      {/* Movie drawer */}
      {selectedMovie && <MovieDrawer movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
