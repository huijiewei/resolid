import { httpNotFound } from "@resolid/framework/utils";
import { mergeMeta } from "@resolid/remix-utils";
import { ErrorComponent } from "~/components/base/ErrorComponent";

export const loader = async () => {
  httpNotFound();
};

export const meta = mergeMeta(() => {
  return [
    {
      title: "页面未找到",
    },
  ];
});

export default function Catchall() {
  return null;
}

export const ErrorBoundary = () => {
  return <ErrorComponent />;
};
