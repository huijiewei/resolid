import { setup } from "@resolid/framework";
import { createHonoNetlifyServer, type NetlifyContext } from "@resolid/react-router-hono/netlify-server";
import { RouterContextProvider } from "react-router";

setup();

// noinspection JSUnusedGlobalSymbols
export default await createHonoNetlifyServer<{
  Bindings: {
    context: NetlifyContext;
  };
}>({
  getLoadContext: (c) => {
    const context = new RouterContextProvider();

    Object.assign(context, {
      remoteAddress: c.env.context.ip,
      requestOrigin: c.env.context.site.url,
    });

    return context;
  },
});
