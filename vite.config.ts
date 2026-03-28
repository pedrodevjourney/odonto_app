import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["lottie-react"],
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/consultas": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/profissionais": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
