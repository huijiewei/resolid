import { unstable_defineAction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { type SuccessData, httpProblem, isSuccess, mergeMeta } from "@resolid/framework/utils";
import { Button, Input } from "@resolid/react-ui";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { userPasswordResetService } from "~/modules/user/service.server";
import { type UserPasswordResetFormData, userPasswordResetResolver } from "~/modules/user/validator";

export const meta = mergeMeta(() => {
  return [{ title: "密码重置" }];
});

export const action = unstable_defineAction(async ({ request }) => {
  const data = await parseFormData<UserPasswordResetFormData>(request);

  const [errors] = await userPasswordResetService(data, new URL(request.url).searchParams.get("token"));

  if (errors) {
    return httpProblem(errors);
  }

  return { success: true };
});

export default function PasswordReset() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<UserPasswordResetFormData>({
    mode: "onSubmit",
    resolver: userPasswordResetResolver,
  });

  const [resetSucceed, setResetSucceed] = useState(false);

  const data = useActionData<typeof action>();

  useEffect(() => {
    if (isSuccess(data as SuccessData)) {
      setResetSucceed(true);
    }
  }, [data]);

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center font-bold text-xl"}>密码重置</h3>
      {errors.token?.message && (
        <div className={"rounded bg-bg-danger p-4 text-fg-danger"}>{errors.token?.message}</div>
      )}
      <Form method={"post"} className={"flex flex-col gap-7"} onSubmit={handleSubmit} noValidate>
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
        <Button
          disabled={resetSucceed}
          color={resetSucceed ? "success" : "primary"}
          size={"lg"}
          className={"tracking-widest"}
          block
          loading={isSubmitting}
          type={"submit"}
        >
          {resetSucceed ? "密码重设成功" : "重设密码"}
        </Button>
      </Form>
    </div>
  );
}
