import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": "http://localhost:5080",
      "/dpp": {
        target: "http://localhost:5080",
        bypass: (request) => request.url?.split("?")[0].endsWith(".jsonld") ? undefined : request.url,
      },
    },
  },
});
