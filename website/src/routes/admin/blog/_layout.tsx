import { mergeMeta } from "@resolid/framework/utils";
import { Outlet } from "react-router";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "博客管理" }];
});

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: () => ({
    link: "/admin/blog",
    label: "博客管理",
  }),
};

// noinspection JSUnusedGlobalSymbols
export default function BlogLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
