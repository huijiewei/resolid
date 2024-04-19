import { HistoryLink } from "~/components/base/history-link";

export const handle = {
  breadcrumb: () => ({
    link: "/admin/blog",
    label: "列表",
  }),
};

export default function BlogIndex() {
  return (
    <div>
      <p>
        <HistoryLink to={"new"}>New blog</HistoryLink>
      </p>
      <ul>
        <li>
          <HistoryLink to={"1"}>Blog 1</HistoryLink>
        </li>
        <li>
          <HistoryLink to={"2"}>Blog 2</HistoryLink>
        </li>
        <li>
          <HistoryLink to={"3"}>Blog 3</HistoryLink>
        </li>
        <li>
          <HistoryLink to={"4"}>Blog NotFound</HistoryLink>
        </li>
      </ul>
    </div>
  );
}
