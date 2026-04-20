import api from "./axios";

export const addReview = (watchedId, body) => api.post(`/watched/${watchedId}/reviews`, { body });

export const deleteReview = (id) => api.delete(`/reviews/${id}`);
