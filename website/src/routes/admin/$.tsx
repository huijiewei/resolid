import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { ErrorComponent } from "~/components/base/error-component";

// noinspection JSUnusedGlobalSymbols
export const loader = async () => {
  httpNotFound();
};

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "页面未找到",
  }),
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
export const ErrorBoundary = () => {
  return <ErrorComponent />;
};
