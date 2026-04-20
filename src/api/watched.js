import api from "./axios";

export const getWatched = () => api.get("/watched");
export const addToWatched = (movie) => api.post("/watched", movie);
export const removeFromWatched = (tmdbId) => api.delete(`/watched/${tmdbId}`);
