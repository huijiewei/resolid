import { getCookieExpires } from "@resolid/framework";
import { RX_DEFAULT_AUTH_GROUP_ID } from "@resolid/framework/modules.server";
import { mergeMeta } from "@resolid/framework/utils";
import { httpProblem, httpRedirect } from "@resolid/framework/utils.server";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { Controller } from "react-hook-form";
import { Form, useSearchParams } from "react-router";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { HistoryLink } from "~/components/base/history-link";
import { commitUserSession, setSessionUser } from "~/foundation/session.user.server";
import { userSignupService } from "~/modules/user/service.server";
import { type UserSignupFormData, userSignupResolver } from "~/modules/user/validator";
import type { Route } from "./+types/signup";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "注册" }];
});

// noinspection JSUnusedGlobalSymbols
export const action = async ({ request, context }: Route.ActionArgs) => {
  const data = await parseFormData<UserSignupFormData>(request);

  const remoteAddr = context.remoteAddress ?? "";
  data.createdIp = remoteAddr;
  data.createdFrom = "WEB";

  const [errors, user] = await userSignupService(data, RX_DEFAULT_AUTH_GROUP_ID);

  if (errors) {
    return httpProblem(errors);
  }

  const session = await setSessionUser(request, user, remoteAddr);

  httpRedirect(
    new URL(request.url).searchParams.get("redirect") ?? "",
    await commitUserSession(session, { expires: getCookieExpires(data.rememberMe ? 365 : undefined) }),
  );
};

// noinspection JSUnusedGlobalSymbols
export default function Signup() {
  const [params] = useSearchParams();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<UserSignupFormData>({
    mode: "onBlur",
    resolver: userSignupResolver,
    defaultValues: {
      rememberMe: true,
    },
  });

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center text-xl font-bold"}>注册新账号</h3>
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
          <label htmlFor={"username"}>用户名</label>
          <Controller
            name={"username"}
            control={control}
            render={({ field: { name, onChange, onBlur, value, ref } }) => (
              <Input
                id={name}
                name={name}
                invalid={Boolean(errors.username?.message)}
                block
                placeholder={"用户名"}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
              />
            )}
          />
          <FormError message={errors.username?.message} />
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
        <div className={"relative flex flex-col gap-1"}>
          <label htmlFor={"confirmPassword"}>确认密码</label>
          <Controller
            name={"confirmPassword"}
            control={control}
            render={({ field: { name, onChange, onBlur, value, ref } }) => (
              <Input
                id={name}
                name={name}
                invalid={Boolean(errors.confirmPassword?.message)}
                type={"password"}
                block
                placeholder={"确认密码"}
                autoComplete={"new-password"}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
              />
            )}
          />
          <FormError message={errors.confirmPassword?.message} />
        </div>
        <div className={"relative flex flex-col gap-3"}>
          <Controller
            name={"agreeTerms"}
            control={control}
            render={({ field: { name, onChange } }) => (
              <Checkbox id={name} name={name} invalid={Boolean(errors.agreeTerms?.message)} onChange={onChange}>
                同意&nbsp;
                <HistoryLink className={"text-link hover:underline"} target={"_blank"} to={"/terms-service"}>
                  服务协议
                </HistoryLink>
                &nbsp;并已阅读&nbsp;
                <HistoryLink className={"text-link hover:underline"} target={"_blank"} to={"/privacy-policy"}>
                  隐私政策
                </HistoryLink>
              </Checkbox>
            )}
          />
          <Controller
            name={"rememberMe"}
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox checked={value} id={name} name={name} onChange={onChange}>
                在这台电脑上保持登陆
              </Checkbox>
            )}
          />
        </div>
        <Button size={"lg"} className={"tracking-widest"} block loading={isSubmitting} type={"submit"}>
          注册
        </Button>
      </Form>
      <div>
        已有账号?&nbsp;
        <HistoryLink className={"text-link hover:underline"} to={{ pathname: "/login", search: params.toString() }}>
          登陆
        </HistoryLink>
      </div>
    </div>
  );
}
