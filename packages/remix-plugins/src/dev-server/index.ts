import { join } from "node:path";
import { honoDevServer } from "./dev-server";

type HonoDevServerOptions = {
  appDirectory?: string;
  entryFile?: string;
  exportName?: string;
  exclude?: (string | RegExp)[];
};

const defaultConfig: Required<HonoDevServerOptions> = {
  appDirectory: "app",
  entryFile: "server.ts",
  exportName: "server",
  exclude: [],
};

export const devServer = (config?: HonoDevServerOptions) => {
  const mergedConfig = { ...defaultConfig, ...config };

  return honoDevServer({
    entry: join(mergedConfig.appDirectory, mergedConfig.entryFile),
    export: mergedConfig.exportName,
    exclude: [
      `/${mergedConfig.appDirectory}/**/*`,
      `/${mergedConfig.appDirectory}/**/.*/**`,
      "/assets/**",
      /^\/@.+$/,
      /\?import$/,
      /^\/favicon\.ico$/,
      /^\/node_modules\/.*/,
      ...mergedConfig.exclude,
    ],
  });
};
