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
        // Don't rewrite the path if your endpoint is actually called /load_top_investments
        // If your backend endpoint is different, use appropriate rewrite
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