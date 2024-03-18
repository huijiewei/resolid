/// <reference types="vite/client" />
/// <reference types="@remix-run/node/globals" />

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

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
