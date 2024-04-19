import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import { getCookieExpires } from "@resolid/framework";
import { mergeMeta } from "@resolid/framework/utils";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { HistoryLink } from "~/components/base/history-link";
import { commitUserSession, setSessionUser } from "~/foundation/session.user.server";
import { userLoginService } from "~/modules/user/service.server";
import { userLoginResolver, type UserLoginFormData } from "~/modules/user/validator";

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const data = await parseFormData<UserLoginFormData>(request);

  const [errors, user] = await userLoginService(data);

  if (errors) {
    response!.status = 422;
    return { errors };
  }

  const session = await setSessionUser(request, user, context.remoteAddress ?? "");

  return redirect(new URL(request.url).searchParams.get("redirect") ?? "", {
    headers: {
      "Set-Cookie": await commitUserSession(session, { expires: getCookieExpires(data.rememberMe ? 365 : undefined) }),
    },
  });
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
    defaultValues: {
      rememberMe: true,
    },
  });

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center text-xl font-bold"}>登陆你的账号</h3>
      <Form method={"post"} className={"flex flex-col gap-7"} onSubmit={handleSubmit} noValidate>
        <div className={"relative flex flex-col gap-1"}>
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
            render={({ field: { name, value, onChange } }) => (
              <Checkbox checked={value} id={name} name={name} onChange={onChange}>
                在这台电脑上保持登陆
              </Checkbox>
            )}
          />

          <HistoryLink
            className={"text-link hover:underline"}
            to={{ pathname: "/password-forgot", search: params.toString() }}
          >
            忘记密码
          </HistoryLink>
        </div>
        <Button size={"lg"} className={"tracking-widest"} block loading={isSubmitting} type={"submit"}>
          登录
        </Button>
      </Form>
      <div>
        还没有账号?&nbsp;
        <HistoryLink className={"text-link hover:underline"} to={{ pathname: "/signup", search: params.toString() }}>
          注册
        </HistoryLink>
      </div>
    </div>
  );
}
