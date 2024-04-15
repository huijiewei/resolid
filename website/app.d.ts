import "@remix-run/node";

declare module "@remix-run/node" {
  interface AppLoadContext {
    readonly remoteAddress?: string;
    readonly requestOrigin?: string;
  }
}
