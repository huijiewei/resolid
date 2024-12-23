import { mergeMeta } from "@resolid/framework/utils";
import { Outlet } from "react-router";

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
