import { createRequestIdMiddleware } from "@resolid/framework/middlewares.server";

export const [requestIdMiddleware, getRequestId] = createRequestIdMiddleware();
