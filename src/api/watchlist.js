import api from "./axios";

export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (movie) => api.post("/watchlist", movie);
export const removeFromWatchlist = (tmdbId) => api.delete(`/watchlist/${tmdbId}`);
