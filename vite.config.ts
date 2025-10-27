import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API calls to backend server
      "/api": "http://localhost:1337/",
    },
  },
});
