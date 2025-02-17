import { Button } from "@resolid/react-ui";
import { SpriteIcon } from "~/components/base/sprite-icon";

// noinspection JSUnusedGlobalSymbols
export default function SiteIndex() {
  return (
    <div className={"prose dark:prose-invert mx-auto max-w-3xl px-4 py-8"}>
      <h1 className={"mt-16 text-center text-[3rem] font-[800] leading-normal md:text-[4rem]"}>Resolid Tech</h1>
      <p className={"text-center"}>
        Resolid 是使用 React Router 驱动的全栈网站，旨在展示使用 React Router、React、Tailwind CSS、Vite、Drizzle
        ORM、PostgreSQL、Hono、Node.js 和 Vercel 等现代 Web 技术构建高性能、可扩展和用户友好的 Web 应用程序的最佳实践。
      </p>
      <div className={"not-prose mt-10 inline-flex w-full items-center justify-center gap-9"}>
        <Button color={"neutral"} size={"xl"}>
          快速开始
        </Button>
        <Button
          color={"neutral"}
          variant={"outline"}
          size={"xl"}
          render={(props) => (
            <a {...props} href={"https://github.com/huijiewei/resolid"} target={"_blank"} rel={"noreferrer"}>
              <SpriteIcon className={"me-2"} name={"github"} />
              Github
            </a>
          )}
        />
      </div>
    </div>
  );
}
