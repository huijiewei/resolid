import { format } from "@formkit/tempo";
import { mergeMeta } from "@resolid/framework/utils";
import { Alert, AlertDescription, AlertTitle } from "@resolid/react-ui";
import { SuspenseComponent } from "~/components/base/suspense-component";
import { getRequestId } from "~/middlewares/request-id.server";
import { getTimezone } from "~/middlewares/timezone.server";
import { statusService } from "~/modules/system/service.server";
import type { Route } from "./+types/status";

// noinspection JSUnusedGlobalSymbols
export const loader = async ({ context }: Route.LoaderArgs) => {
  const timezone = getTimezone(context);

  return {
    ssr: {
      message: "服务器渲染正常",
      timezone: timezone,
      datetime: format({
        date: new Date(),
        format: "YYYY-MM-DD HH:mm",
        tz: timezone,
      }),
      remoteAddress: context.remoteAddress ?? "",
      requestId: getRequestId(context),
    },
    db: statusService
      .getFirst()
      .then(() => ({ success: true, message: "数据库访问正常" }))
      .catch(() => ({ success: false, message: "数据库访问失败" })),
  };
};

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [
    {
      title: "运行状态",
    },
  ];
});

// noinspection JSUnusedGlobalSymbols
export default function Status({ loaderData }: Route.ComponentProps) {
  const { ssr, db } = loaderData;

  return (
    <div className={"prose dark:prose-invert mx-auto px-4 py-8"}>
      <h1 className={"text-center"}>运行状态</h1>
      <Alert color={"success"} className={"my-5"}>
        <AlertTitle>静态页面访问正常</AlertTitle>
      </Alert>
      <Alert color={"success"} className={"my-5"}>
        <AlertTitle>{ssr.message}</AlertTitle>
      </Alert>
      <SuspenseComponent
        data={db}
        render={(db) => (
          <Alert color={db.success ? "success" : "danger"} className={"my-5"}>
            <AlertTitle>{db.message}</AlertTitle>
          </Alert>
        )}
        fallback={
          <Alert color={"warning"} className={"my-5"}>
            <AlertTitle>正在查询数据库状态</AlertTitle>
          </Alert>
        }
      />
      <Alert color={"primary"} className={"not-prose my-5"}>
        <AlertDescription>
          <dl className={""}>
            <dt className={"float-left w-1/5"}>客户端地址：</dt>
            <dd className={"font-mono"}>{ssr.remoteAddress}</dd>
            <dt className={"float-left w-1/5"}>客户端时区：</dt>
            <dd className={"font-mono"}>{ssr.timezone}</dd>
            <dt className={"float-left w-1/5"}>服务器时间：</dt>
            <dd className={"font-mono"}>{ssr.datetime}</dd>
            <dt className={"float-left w-1/5"}>请求 Id：</dt>
            <dd className={"font-mono"}>{ssr.requestId}</dd>
          </dl>
        </AlertDescription>
      </Alert>
    </div>
  );
}
