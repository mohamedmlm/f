import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const readHttps = () => {
  // Only attempt to read local key/cert during development
  if (process.env.NODE_ENV === "production") return false;
  try {
    if (fs.existsSync("key.pem") && fs.existsSync("cert.pem")) {
      return {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      };
    }
  } catch (err) {
    // ignore and fall through to disabling https
  }
  return false;
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    https: readHttps(),
  },
  preview: {
    host: "localhost",
    port: 4173,
    https: readHttps(),
  },
});
