import { Form, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { userService, userSignupResolver, type UserSignupFormData } from "@resolid/framework/modules";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { mergeMeta, responseRedirect } from "@resolid/remix-utils";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/FormError";
import { HistoryLink } from "~/components/base/HistoryLink";
import { commitUserSession, setSessionUser } from "../../../foundation/session.server";

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const data = await parseFormData<UserSignupFormData>(request);

  const remoteAddr = context.remoteAddress ?? "";

  const [errors, user] = await userService.authSignup(data, remoteAddr as string);

  if (errors) {
    response!.status = 422;
    return { errors };
  }

  const session = await setSessionUser(request, user, remoteAddr);

  response!.headers.set("Set-Cookie", await commitUserSession(session, { maxAge: 60 * 60 * 24 * 30 }));

  return responseRedirect(response!, new URL(request.url).searchParams.get("redirect") ?? "/");
};

export const meta = mergeMeta(() => {
  return [{ title: "注册" }];
});

export default function Signup() {
  const [params] = useSearchParams();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<UserSignupFormData>({
    mode: "onBlur",
    resolver: userSignupResolver,
  });

  return (
    <div className={"mx-auto w-96"}>
      <div className={"flex flex-col gap-2 py-10"}>
        <h3 className={"py-3 text-center text-xl font-bold"}>注册新账号</h3>
        <Form method={"post"} className={"flex flex-col gap-7"} onSubmit={handleSubmit} noValidate>
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
          <div className={"relative"}>
            <Controller
              name={"agreeTerms"}
              control={control}
              render={({ field: { name, onChange } }) => (
                <Checkbox id={name} name={name} invalid={Boolean(errors.agreeTerms?.message)} onChange={onChange}>
                  同意&nbsp;
                  <HistoryLink className={"text-link hover:text-link-hovered"} target={"_blank"} to={"/terms-service"}>
                    服务协议
                  </HistoryLink>
                  &nbsp;并已阅读&nbsp;
                  <HistoryLink className={"text-link hover:text-link-hovered"} target={"_blank"} to={"/privacy-policy"}>
                    隐私声明
                  </HistoryLink>
                </Checkbox>
              )}
            />
          </div>
          <div className={"flex flex-row gap-1 text-center"}>
            <Button size={"lg"} className={"tracking-widest"} block loading={isSubmitting} type={"submit"}>
              注册
            </Button>
          </div>
        </Form>
        <div className={""}>
          已有账号?&nbsp;
          <HistoryLink className={"text-link underline"} to={{ pathname: "/login", search: params.toString() }}>
            登陆
          </HistoryLink>
        </div>
      </div>
    </div>
  );
}
