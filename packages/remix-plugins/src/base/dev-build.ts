const viteDevServer =
  process.env.NODE_ENV == "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true, ws: false },
          appType: "custom",
        }),
      );

export async function importDevBuild() {
  return viteDevServer?.ssrLoadModule("virtual:remix/server-build");
}
