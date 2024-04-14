import { Outlet } from "@remix-run/react";
import { mergeMeta } from "@resolid/remix-utils";

export const meta = mergeMeta(() => {
  return [{ title: "博客管理" }];
});

export const handle = {
  breadcrumb: () => ({
    link: "/admin/blog",
    label: "博客管理",
  }),
};

export default function BlogLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
