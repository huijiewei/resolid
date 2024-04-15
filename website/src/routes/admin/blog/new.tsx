import { mergeMeta } from "@resolid/framework/utils";

export const meta = mergeMeta(() => {
  return [{ title: "创建" }];
});

export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "创建",
  }),
};

export default function BlogNew() {
  return <div>New</div>;
}
