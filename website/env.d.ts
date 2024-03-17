/// <reference types="vite/client" />
/// <reference types="@remix-run/node/globals" />
/// <reference types="@resolid/framework/env" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    BUILD_ENV: "vercel" | undefined;

    RX_RUNTIME: "vercel" | "node" | undefined;
    RX_PROXY: number;
    RX_PROXY_COUNT: number;

    RX_COOKIE_SECRET: string;

    RX_TURNSTILE_SECRET: string;
  }
}

import "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    readonly remoteAddress: string;
    readonly requestOrigin?: string;
  }
}
