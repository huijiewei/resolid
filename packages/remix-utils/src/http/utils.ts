import type { Socket } from "node:net";

export type GetClientIpOptions = { proxy: boolean; ipHeaders?: string; maxIpsCount?: number };

export const getClientIp = (req: Request, socket: Socket, options?: GetClientIpOptions) => {
  const { proxy = false, ipHeaders = "x-forwarded-for", maxIpsCount = 0 } = options || {};

  const val = req.headers.get(ipHeaders);

  let ips = proxy && val ? val.split(/\s*,\s*/) : [];

  if (maxIpsCount > 0) {
    ips = ips.slice(-maxIpsCount);
  }

  return ips[0] || socket.remoteAddress || "";
};

export const getRequestProtocol = (req: Request, socket: Socket, proxy = false) => {
  if ((socket as Socket & { encrypted?: boolean }).encrypted) {
    return "https";
  }

  if (!proxy) {
    return "http";
  }

  const proto = req.headers.get("x-forwarded-proto");

  return proto ? proto.split(/\s*,\s*/, 1)[0] : "http";
};

export const getRequestHost = (req: Request, proxy = false) => {
  const host = proxy && req.headers.get("x-forwarded-host");

  return host ? host.split(/\s*,\s*/, 1)[0] : req.headers.get("host");
};

export const getRequestOrigin = (req: Request, socket: Socket, proxy = false) => {
  const protocol = getRequestProtocol(req, socket, proxy);
  const host = getRequestHost(req, proxy);

  return `${protocol}://${host}`;
};
