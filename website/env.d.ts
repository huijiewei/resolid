/// <reference types="vite/client" />
/// <reference types="@react-router/node" />

declare namespace NodeJS {
  export interface ProcessEnv {
    readonly SERVER_PORT: number | undefined;

    readonly RX_DB_URI: string;
    readonly RX_DB_SSL_CA: string;
    readonly RX_DB_TABLE_PREFIX: string;

    readonly RX_MAILER_DSN: string;
    readonly RX_MAILER_FROM: string;

    readonly RX_SUPPORT_EMAIL: string;

    readonly RX_PROXY: number;
    readonly RX_PROXY_COUNT: number;

    readonly RX_COOKIE_SECRET: string;
    readonly RX_TURNSTILE_SECRET: string;

    readonly NETLIFY: boolean;
    readonly VERCEL_URL: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_NETLIFY?: boolean;
  readonly VITE_VERCEL_URL?: string;
  readonly VITE_TURNSTILE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
