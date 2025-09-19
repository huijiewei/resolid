import { env } from "node:process";

export type SetupOptions = {
  timezone?: string;
};

export const setup = (options: SetupOptions) => {
  env.TZ = options.timezone;
};
