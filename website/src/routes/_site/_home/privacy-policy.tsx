import { mergeMeta } from "@resolid/framework/utils";

export const meta = mergeMeta(() => {
  return [{ title: "隐私声明" }];
});

export default function PrivacyPolicy() {
  return (
    <div className={"prose mx-auto max-w-3xl px-4 py-8 dark:prose-invert"}>
      <h1 className={"text-center"}>隐私声明</h1>
    </div>
  );
}
