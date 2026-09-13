import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps every asset path relative, so the site works
// at https://<user>.github.io/<repo>/ as well as locally.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
