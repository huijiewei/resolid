import { mergeMeta } from "@resolid/framework/utils";
import { ErrorComponent } from "~/components/base/error-component";

// noinspection JSUnusedGlobalSymbols
export const loader = async () => {
  throw new Response("Not Found", { status: 404 });
};

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: {
    link: "",
    label: "页面未找到",
  },
};

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [
    {
      title: "页面未找到",
    },
  ];
});

// noinspection JSUnusedGlobalSymbols
export default function Catchall() {
  return null;
}

// noinspection JSUnusedGlobalSymbols
export const ErrorBoundary = ErrorComponent;
