import { defineConfig } from "vite";

const pages = ["login", "dashboard"];

export default defineConfig({
  plugins: [
    {
      // Match production (express.static) by redirecting /login to /login/ in dev.
      name: "trailing-slash",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (pages.some((p) => req.url === `/${p}`)) {
            res.writeHead(301, { Location: `${req.url}/` }).end();
          } else next();
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ...Object.fromEntries(pages.map((p) => [p, `${p}/index.html`])),
      },
    },
  },
});
