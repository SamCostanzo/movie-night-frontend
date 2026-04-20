import axios from "axios";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const searchMovies = (query) => tmdb.get("/search/movie", { params: { query } });

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos,similar" },
  });

export const getGenres = () => tmdb.get("/genre/movie/list");

export const discoverMovies = (params) => tmdb.get("/discover/movie", { params });
