import axios from "axios";

// Backend base URL comes from frontend/.env (VITE_API_BASE_URL).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

/** Turns an Axios error into a readable message for the UI. */
export function errorMessage(err) {
  const data = err?.response?.data;
  if (data?.errors && Object.keys(data.errors).length > 0) {
    return Object.values(data.errors).join(" | ");
  }
  if (data?.message) return data.message;
  if (err?.code === "ERR_NETWORK") {
    return "Cannot reach the backend. Is Spring Boot running on port 8080?";
  }
  return err?.message || "Something went wrong";
}

export default api;
