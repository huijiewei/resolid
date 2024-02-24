/// <reference types="vite/client" />
/// <reference types="@remix-run/node/globals" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    // noinspection JSUnusedGlobalSymbols
    interface ProcessEnv {
      NODE_ENV: "development" | "production";

      BUILD_ENV: "vercel" | undefined;
      RX_RUNTIME: "vercel" | "node" | undefined;

      RX_DB_HOST: string;
      RX_DB_PORT: number;
      RX_DB_USER: string;
      RX_DB_PASSWORD: string;
      RX_DB_DATABASE: string;

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
  // noinspection JSUnusedGlobalSymbols
  interface AppLoadContext {
    readonly remoteAddress: string;
  }
}
