import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      '/load_top_investments': {
        target: 'https://cdtmbackend.onrender.com', // Replace with your backend API
        changeOrigin: true,  // Ensure the origin is changed
        secure: true,       // If you're using HTTP, set to false; true for HTTPS
        rewrite: (path) => path.replace(/^\/load_top_investments/, ''),
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