import { mergeMeta } from "@resolid/framework/utils";
import { HistoryLink } from "~/components/base/history-link";

export const meta = mergeMeta(() => {
  return [{ title: "首页" }];
});

export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "主页",
  }),
};

export default function AdminIndex() {
  return (
    <div className={""}>
      <p>
        <HistoryLink to={"about"}>Admin About</HistoryLink>
      </p>
      <p>Admin Index</p>
    </div>
  );
}
