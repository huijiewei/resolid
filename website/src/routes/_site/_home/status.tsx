import { format } from "@formkit/tempo";
import { Await } from "@remix-run/react";
import { type TypedLoaderArgs, mergeMeta, useTypedLoaderData } from "@resolid/framework/utils";
import { Alert, AlertDescription, AlertTitle } from "@resolid/react-ui";
import { Suspense } from "react";
import { statusService } from "~/modules/system/service.server";

export const loader = ({ context }: TypedLoaderArgs) => {
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
    <div className={"prose dark:prose-invert mx-auto px-4 py-8"}>
      <h1 className={"text-center"}>运行状态</h1>
      <Alert color={"success"} className={"my-5"}>
        <AlertTitle>静态页面访问正常</AlertTitle>
      </Alert>
      <Alert color={"success"} className={"my-5"}>
        <AlertTitle>{ssr.message}</AlertTitle>
      </Alert>
      <Suspense
        fallback={
          <Alert color={"warning"} className={"my-5"}>
            <AlertTitle>正在查询数据库状态</AlertTitle>
          </Alert>
        }
      >
        <Await resolve={db}>
          {(db) => (
            <Alert color={db.success ? "success" : "danger"} className={"my-5"}>
              <AlertTitle>{db.message}</AlertTitle>
            </Alert>
          )}
        </Await>
      </Suspense>
      <Alert color={"primary"} className={"my-5"}>
        <AlertDescription>
          客户端地址：<span className={"font-mono"}>{ssr.ip}</span>
          <br />
          服务器时间：<span className={"font-mono"}>{ssr.now}</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
