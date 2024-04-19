import { httpNotFound, mergeMeta } from "@resolid/framework/utils";
import { ErrorComponent } from "~/components/base/error-component";

export const loader = async () => {
  httpNotFound();
};

export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "页面未找到",
  }),
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
