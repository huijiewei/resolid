import { createTimezoneScript } from "@resolid/framework/middlewares";

export const timezoneScript = createTimezoneScript({
  cookieName: "rx-timezone",
});
