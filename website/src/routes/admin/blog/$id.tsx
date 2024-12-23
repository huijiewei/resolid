import { mergeMeta } from "@resolid/framework/utils";
import { httpNotFound } from "@resolid/framework/utils.server";
import { useLoaderData } from "react-router";
import { ErrorComponent } from "~/components/base/error-component";
import type { Route } from "./+types/$id";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(({ data }: Route.MetaArgs) => {
  return [{ title: data ? data.title : "记录不存在" }];
});

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: (data: { title: string }) => {
    return {
      link: "",
      label: data ? data.title : "记录不存在",
    };
  },
};

export const loader = ({ params }: Route.LoaderArgs) => {
  const id = params.id as string;

  if (!["1", "2", "3"].includes(id)) {
    httpNotFound("博客不存在");
  }

  return { id: params.id, title: `Blog ${id}` };
};

// noinspection JSUnusedGlobalSymbols
export default function BlogView() {
  const blog = useLoaderData<typeof loader>();

  return <div>{blog.title}</div>;
}

// noinspection JSUnusedGlobalSymbols
export const ErrorBoundary = () => {
  return <ErrorComponent />;
};
