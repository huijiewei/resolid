import { isSuccess, mergeMeta } from "@resolid/framework/utils";
import { httpProblem } from "@resolid/framework/utils.server";
import { Button, Input } from "@resolid/react-ui";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Form, useActionData } from "react-router";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { userService } from "~/modules/user/service.server";
import { type UserPasswordResetFormData, userPasswordResetResolver } from "~/modules/user/validator";
import type { Route } from "./+types/password-reset";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "密码重置" }];
});

export const action = async ({ request }: Route.ActionArgs) => {
  const data = await parseFormData<UserPasswordResetFormData>(request);

  const [errors] = await userService.passwordReset(data, new URL(request.url).searchParams.get("token"));

  if (errors) {
    return httpProblem(errors);
  }

  return { success: true };
};

// noinspection JSUnusedGlobalSymbols
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
    if (isSuccess(data)) {
      setResetSucceed(true);
    }
  }, [data]);

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center text-xl font-bold"}>密码重置</h3>
      {errors.token?.message && (
        <div className={"bg-bg-danger text-fg-danger rounded-md p-4"}>{errors.token?.message}</div>
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
                className={"w-full"}
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
                className={"w-full"}
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
          className={"w-full tracking-widest"}
          loading={isSubmitting}
          type={"submit"}
        >
          {resetSucceed ? "密码重设成功" : "重设密码"}
        </Button>
      </Form>
    </div>
  );
}
