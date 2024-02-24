import { Outlet } from "@remix-run/react";

export const meta = () => {
  return [{ title: "Resolid 管理面板" }];
};

export default function AdminLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
