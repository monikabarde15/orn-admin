import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),

    {
      name: "redirect-to-admin",

      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            req.url === "/" ||
            req.url === "/index" ||
            req.url === "/index.html"
          ) {
            res.statusCode = 302;
            res.setHeader("Location", "/vidya-gyan-admin/");
            res.end();
            return;
          }

          next();
        });
      },
    },
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  base: "/vidya-gyan-admin/",
});