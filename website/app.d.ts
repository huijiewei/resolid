declare module "react-router" {
  interface AppLoadContext {
    readonly requestId?: string;
    readonly remoteAddress?: string;
    readonly requestOrigin?: string;
  }
}

export {};
