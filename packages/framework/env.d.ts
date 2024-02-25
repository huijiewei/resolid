declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RX_DB_URL: string;
      RX_DB_TABLE_PREFIX?: string;
    }
  }
}
