import { mergeMeta } from "@resolid/framework/utils";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "创建" }];
});

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumb: () => ({
    link: "",
    label: "创建",
  }),
};

// noinspection JSUnusedGlobalSymbols
export default function BlogNew() {
  return <div>New</div>;
}
