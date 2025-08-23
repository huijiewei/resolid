declare module "react-router" {
  interface AppLoadContext {
    readonly remoteAddress?: string;
    readonly requestOrigin?: string;
  }
}

export {};
