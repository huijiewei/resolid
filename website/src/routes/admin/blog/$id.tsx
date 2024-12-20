import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { ErrorComponent } from "~/components/base/error-component";

export const meta = mergeMeta<typeof loader>(({ data }) => {
  return [{ title: data ? data.title : "记录不存在" }];
});

export const handle = {
  breadcrumb: (data: { title: string }) => {
    return {
      link: "",
      label: data ? data.title : "记录不存在",
    };
  },
};

export const loader = ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;

  if (!["1", "2", "3"].includes(id)) {
    httpNotFound("博客不存在");
  }

  return { id: params.id, title: `Blog ${id}` };
};

export default function BlogView() {
  const blog = useLoaderData<typeof loader>();

  return <div>{blog.title}</div>;
}

export const ErrorBoundary = () => {
  return <ErrorComponent />;
};
