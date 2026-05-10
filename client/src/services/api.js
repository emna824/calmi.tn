import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000
});

export async function predictFull(payload) {
  const { data } = await api.post("/predict/full", payload);
  return data;
}

export default api;

