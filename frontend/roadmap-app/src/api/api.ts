import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Change if backend is elsewhere

const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
