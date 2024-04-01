import { format } from "@formkit/tempo";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Await } from "@remix-run/react";
import { clsx } from "@resolid/react-ui";
import { mergeMeta, useTypedLoaderData } from "@resolid/remix-utils";
import { Suspense } from "react";
import { statusService } from "~/modules/system/service.server";

export const loader = ({ context }: LoaderFunctionArgs) => {
  return {
    ssr: {
      message: "服务器渲染正常",
      now: format(new Date(), "YYYY-MM-DD HH:mm Z"),
      ip: context.remoteAddress ?? "",
    },
    db: statusService
      .getFirst()
      .then(() => ({ success: true, message: "数据库访问正常" }))
      .catch(() => ({ success: false, message: "数据库访问失败" })),
  };
};

export const meta = mergeMeta(() => {
  return [
    {
      title: "运行状态",
    },
  ];
});

export default function Status() {
  const { ssr, db } = useTypedLoaderData<typeof loader>();

  return (
    <div className={"prose mx-auto px-4 py-8 dark:prose-invert"}>
      <h1 className={"text-center"}>运行状态</h1>
      <p className={"rounded-lg bg-green-50/60 p-4 font-bold text-fg-success"}>静态页面访问正常</p>
      <p className={"rounded-lg bg-green-50/60 p-4 font-bold text-fg-success"}>{ssr.message}</p>
      <Suspense
        fallback={<p className="rounded-lg bg-yellow-50/60 p-4 font-bold text-fg-warning">正在查询数据库状态</p>}
      >
        <Await resolve={db}>
          {(db) => (
            <p
              className={clsx(
                "rounded-lg p-4 font-bold",
                db.success ? "bg-green-50/60 text-fg-success" : "bg-red-50/60 text-fg-danger",
              )}
            >
              {db.message}
            </p>
          )}
        </Await>
      </Suspense>
      <p className={"rounded-lg bg-blue-50/60 p-4"}>
        客户端地址：<span className={"font-mono"}>{ssr.ip}</span>
        <br />
        服务器时间：<span className={"font-mono"}>{ssr.now}</span>
      </p>
    </div>
  );
}
