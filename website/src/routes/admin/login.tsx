import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getCookieExpires } from "@resolid/framework";
import { mergeMeta } from "@resolid/framework/utils";
import { Button, Checkbox, Input } from "@resolid/react-ui";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { commitAdminSession, setSessionAdmin } from "~/foundation/session.admin.server";
import { adminLoginService } from "~/modules/admin/service.server";
import { adminLoginResolver, type AdminLoginFormData } from "~/modules/admin/validator";

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const data = await parseFormData<AdminLoginFormData>(request);

  const [errors, admin] = await adminLoginService(data);

  if (errors) {
    response!.status = 422;
    return { errors };
  }

  const session = await setSessionAdmin(request, admin, context.remoteAddress ?? "");

  return redirect(new URL(request.url).searchParams.get("redirect") ?? "", {
    headers: {
      "Set-Cookie": await commitAdminSession(session, {
        expires: getCookieExpires(data?.rememberMe ? 365 : undefined),
      }),
    },
  });
};

export const meta = mergeMeta(() => {
  return [{ title: "登陆" }];
});

export default function Login() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<AdminLoginFormData>({
    mode: "onBlur",
    resolver: adminLoginResolver,
    defaultValues: {
      rememberMe: true,
    },
  });

  return (
    <div className={"mx-auto flex w-96 flex-col gap-5 py-10"}>
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
        </div>
        <Button size={"lg"} className={"tracking-widest"} block loading={isSubmitting} type={"submit"}>
          登录
        </Button>
      </Form>
    </div>
  );
}
