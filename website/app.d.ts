import "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    readonly remoteAddress: string;
    readonly requestOrigin?: string;
  }
}
