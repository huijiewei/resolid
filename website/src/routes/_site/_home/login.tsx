import { Form, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { userLoginResolver, userService, type UserLoginFormData } from "@resolid/framework/modules";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { mergeMeta, responseRedirect } from "@resolid/remix-utils";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/FormError";
import { HistoryLink } from "~/components/base/HistoryLink";
import { commitUserSession, setSessionUser } from "../../../foundation/session.server";

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const data = await parseFormData<UserLoginFormData>(request);
  const [errors, user] = await userService.authLogin(data);

  if (errors) {
    response!.status = 422;
    return { errors };
  }

  const session = await setSessionUser(request, user, context.remoteAddress ?? "");

  response!.headers.set(
    "Set-Cookie",
    await commitUserSession(session, { maxAge: data?.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 30 }),
  );

  return responseRedirect(response!, new URL(request.url).searchParams.get("redirect") ?? "/");
};

export const meta = mergeMeta(() => {
  return [{ title: "登陆" }];
});

export default function Login() {
  const [params] = useSearchParams();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<UserLoginFormData>({
    mode: "onBlur",
    resolver: userLoginResolver,
  });

  return (
    <div className={"mx-auto w-96"}>
      <div className={"flex flex-col gap-2 py-10"}>
        <h3 className={"py-3 text-center text-xl font-bold"}>登陆你的账号</h3>
        <Form method={"post"} className={"flex flex-col gap-8"} onSubmit={handleSubmit} noValidate>
          <div className={"relative flex flex-col gap-2"}>
            <label htmlFor={"email"}>电子邮箱</label>
            <Controller
              name={"email"}
              control={control}
              render={({ field: { name, onChange, onBlur, value, ref } }) => (
                <Input
                  id={name}
                  name={name}
                  invalid={Boolean(errors.email?.message)}
                  type={"email"}
                  block
                  placeholder={"电子邮箱"}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                />
              )}
            />
            <FormError message={errors.email?.message} />
          </div>
          <div className={"relative flex flex-col gap-1"}>
            <label htmlFor={"password"}>密码</label>
            <Controller
              name={"password"}
              control={control}
              render={({ field: { name, onChange, onBlur, value, ref } }) => (
                <Input
                  id={name}
                  name={name}
                  invalid={Boolean(errors.password?.message)}
                  type={"password"}
                  block
                  placeholder={"密码"}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                />
              )}
            />
            <FormError message={errors.password?.message} />
          </div>
          <div className={"flex flex-row items-center justify-between"}>
            <Controller
              name={"rememberMe"}
              control={control}
              render={({ field: { name, onChange } }) => (
                <Checkbox defaultChecked={true} id={name} name={name} onChange={onChange}>
                  保持登陆
                </Checkbox>
              )}
            />

            <HistoryLink
              className={"text-link underline"}
              to={{ pathname: "/forgot-password", search: params.toString() }}
            >
              忘记密码
            </HistoryLink>
          </div>
          <div className={"flex flex-row gap-1 text-center"}>
            <Button size={"lg"} className={"tracking-widest"} block loading={isSubmitting} type={"submit"}>
              登录
            </Button>
          </div>
        </Form>
        <div className={""}>
          还没有账号?&nbsp;
          <HistoryLink className={"text-link underline"} to={{ pathname: "/signup", search: params.toString() }}>
            注册
          </HistoryLink>
        </div>
      </div>
    </div>
  );
}
