import { mergeMeta } from "@resolid/remix-utils";
import { HistoryLink } from "~/components/base/HistoryLink";

export const meta = mergeMeta(() => {
  return [{ title: "关于" }];
});

export const handle = {
  breadcrumb: () => ({
    link: "/admin/about",
    label: "关于",
  }),
};

export default function AdminAbout() {
  return (
    <div>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>About</p>
      <p>
        <HistoryLink to={"/admin"}>Admin Index</HistoryLink>
      </p>
    </div>
  );
}
