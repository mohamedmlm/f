import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readHttps = () => {
  // Only attempt to read local key/cert during development
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  try {
    const keyPath = path.resolve(__dirname, "certs", "localhost.key");
    const certPath = path.resolve(__dirname, "certs", "localhost.crt");

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
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
    proxy: {
      "/api": {
        target: "https://backend-zeta-steel-44.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: "localhost",
    port: 4173,
    https: readHttps(),
  },
});
