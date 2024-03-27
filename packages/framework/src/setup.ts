import { env } from "node:process";

export const setup = () => {
  env.TZ = "UTC";
};
