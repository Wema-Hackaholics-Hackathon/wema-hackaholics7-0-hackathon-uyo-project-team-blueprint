import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// NOTE: Temporary auth fix (no backend changes). The backend issues a 30-minute
// access token but exposes no refresh endpoint, and its token decoder never
// checks the token type. We therefore send the 7-day refresh token as the bearer
// so requests stay authenticated far longer. Replace with a proper access-token
// + /accounts/refresh flow once the backend supports it. (See AGENTS.md / memory.)
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("traka_user");
  if (stored) {
    try {
      const { refreshToken } = JSON.parse(stored);
      if (refreshToken) config.headers.Authorization = `Bearer ${refreshToken}`;
    } catch { /* ignore */ }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("traka_user");
      window.dispatchEvent(new Event("traka:unauthorized"));
    }
    return Promise.reject(err);
  },
);
