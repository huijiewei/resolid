import { env } from "node:process";
import { z } from "zod";

export type SetupOptions = {
  timezone?: string;
  zodConfig?: z.core.$ZodConfig;
};

export const setup = (options: SetupOptions) => {
  env.TZ = options.timezone;
  z.config(options.zodConfig);
};
