import { createTimezoneMiddleware } from "@resolid/framework/middlewares.server";

export const [timezoneMiddleware, getTimezone] = createTimezoneMiddleware({
  cookieName: "rx-timezone",
});
