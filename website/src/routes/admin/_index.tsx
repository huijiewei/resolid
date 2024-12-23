import { mergeMeta } from "@resolid/framework/utils";
import { HistoryLink } from "~/components/base/history-link";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "首页" }];
});

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "主页",
  }),
};

// noinspection JSUnusedGlobalSymbols
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
