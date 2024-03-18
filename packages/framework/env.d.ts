declare namespace NodeJS {
  export interface ProcessEnv {
    readonly RX_DB_URL?: string;
    readonly RX_DB_TABLE_PREFIX?: string;

    readonly RX_MAILER_DSN?: string;
    readonly RX_MAILER_FROM?: string;
  }
}
