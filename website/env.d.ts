/// <reference types="vite/client" />
/// <reference types="@remix-run/node/globals" />
/// <reference types="@resolid/framework/env" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";

      BUILD_ENV: "vercel" | undefined;

      RX_RUNTIME: "vercel" | "node" | undefined;
      RX_PROXY: number;
      RX_PROXY_COUNT: number;

      RX_DB_URL: string;
      RX_DB_TABLE_PREFIX?: string;

      RX_COOKIE_SECRET: string;

      RX_TURNSTILE_SECRET: string;

      RX_EMAIL_BREVO_API_KEY?: string;
      RX_EMAIL_SENDER_NAME?: string;
      RX_EMAIL_SENDER_EMAIL?: string;
    }
  }
}

import "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    readonly remoteAddress: string;
  }
}
