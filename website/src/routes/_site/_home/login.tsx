import { Form, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { userLoginResolver, userService, type UserLoginFormData } from "@resolid/framework/modules";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { useTypedActionData } from "@resolid/remix-utils";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/FormError";
import { HistoryLink } from "~/components/base/HistoryLink";

export const action = async ({ request, response }: ActionFunctionArgs) => {
  const data = await parseFormData<UserLoginFormData>(request);
  const [errors, user] = await userService.authLogin(data);

  if (errors) {
    response!.status = 422;
    return { errors };
  }

  return { user };
};

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

  const data = useTypedActionData<typeof action>();

  useEffect(() => {
    if (data && !data.errors) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className={"mx-auto my-10 w-96"}>
      <div className={"flex flex-col gap-2"}>
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
                <Checkbox id={name} name={name} onChange={onChange}>
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
