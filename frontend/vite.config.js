import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const workspaceRoute = /^\/(?:login|register|forget-password|reset-password|bachelor|owner|admin)(?:\/|$)/;

function serveWorkspace(server) {
  server.middlewares.use((request, _response, next) => {
    const url = new URL(request.url, "http://localhost");
    if (workspaceRoute.test(url.pathname)) request.url = "/app.html" + url.search;
    next();
  });
}

export default defineConfig({
  appType: "mpa",
  build: { rolldownOptions: { input: ["index.html", "app.html"] } },
  plugins: [react(), {
    name: "workspace-routes",
    transformIndexHtml(html) {
      if (!html.includes("<!-- site-footer -->")) return html;
      return html.replace("<!-- site-footer -->", () =>
        readFileSync(new URL("./src/components/site-footer.html", import.meta.url), "utf8"));
    },
    configureServer: serveWorkspace,
    configurePreviewServer: serveWorkspace,
  }],
})
