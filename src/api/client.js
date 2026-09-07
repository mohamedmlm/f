import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://backend-35mldvenj-invtroll.vercel.app";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('chater_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
  
      localStorage.removeItem('chater_token');

    }
    return Promise.reject(error);
  }
);

export function fileUrl(kind, filename) {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  const folder = kind === "avatar" ? "Avatar" : "ItemImages";
  return `${API_URL}/${folder}/${filename}`;
}

export function extractError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "حدث خطأ غير متوقع، حاول مرة أخرى";
  return (
    data.msg ||
    data.message ||
    data.error ||
    (Array.isArray(data.errors) && data.errors[0]?.msg) ||
    "حدث خطأ غير متوقع، حاول مرة أخرى"
  );
}

export default client;