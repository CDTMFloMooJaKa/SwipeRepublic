import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/load_top_investments': {
        target: 'https://cdtmbackend.onrender.com',  // Your backend API
        changeOrigin: true,  // Ensures the origin of the request is changed to the target's origin
        secure: true,       // Should be true for HTTPS. If using HTTP, set to false.
        rewrite: (path) => path.replace(/^\/load_top_investments/, ''),  // Rewriting path as needed
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));