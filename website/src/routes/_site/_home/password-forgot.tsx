import { addDay } from "@formkit/tempo";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { createFieldErrors, isSuccess, mergeMeta } from "@resolid/framework/utils";
import { httpProblem } from "@resolid/framework/utils.server";
import { Button, Input } from "@resolid/react-ui";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Form, useActionData, useSearchParams } from "react-router";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { HistoryLink } from "~/components/base/history-link";
import { trunstileVerify } from "~/extensions/turnstile/trunstile.server";
import { TurnstileWidget } from "~/extensions/turnstile/turnstile-widget";
import { userPasswordResetEmailService, userService } from "~/modules/user/service.server";
import { type UserPasswordForgotFormData, userPasswordForgotResolver } from "~/modules/user/validator";
import type { Route } from "./+types/password-forgot";

// noinspection JSUnusedGlobalSymbols
export const meta = mergeMeta(() => {
  return [{ title: "忘记密码" }];
});

export const action = async ({ request, context }: Route.ActionArgs) => {
  const data = await parseFormData<UserPasswordForgotFormData>(request);

  const captcha = await trunstileVerify(data.token);

  if (!captcha.success) {
    return httpProblem(createFieldErrors({ captcha: "验证失败" }));
  }

  const expiredAt = addDay(new Date(), 1);
  const userAgent = request.headers.get("user-agent") ?? "";

  const [errors, result] = await userService.passwordForgot(data, expiredAt, context.remoteAddress ?? "", userAgent);

  if (errors) {
    return httpProblem(errors);
  }

  const baseUrl = context.requestOrigin ?? request.url;
  const resetUrl = new URL(`/password-reset?token=${result.resetId}`, baseUrl).toString();

  const send = await userPasswordResetEmailService(result.identity, baseUrl, resetUrl, expiredAt, userAgent);

  if (!send.success) {
    return httpProblem(createFieldErrors({ email: "邮件发送失败" }));
  }

  return { success: true };
};

// noinspection JSUnusedGlobalSymbols
export default function PasswordForgot() {
  const [params] = useSearchParams();

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<TurnstileInstance>(null);

  const [sendSucceed, setSendSucceed] = useState(false);

  const data = useActionData<typeof action>();

  useEffect(() => {
    if (isSuccess(data)) {
      setCaptchaVerified(false);
      setSendSucceed(true);
    } else {
      captchaRef.current?.reset();
    }
  }, [data]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useRemixForm<UserPasswordForgotFormData>({
    mode: "onSubmit",
    resolver: userPasswordForgotResolver,
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center text-xl font-bold"}>忘记密码</h3>
      <p className={"text-fg-subtle text-center text-sm"}>输入你的电子邮箱，我们将向你发送用于重置密码的链接。</p>
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
                className={"w-full"}
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
        <div className={"flex justify-center"}>
          <Controller
            name={"token"}
            control={control}
            render={({ field: { onChange } }) => (
              <TurnstileWidget
                ref={captchaRef}
                onSuccess={(token) => {
                  onChange(token);
                  setCaptchaVerified(true);
                }}
                options={{ responseField: false }}
              />
            )}
          />
        </div>
        <Button
          size={"lg"}
          className={"w-full tracking-widest"}
          disabled={!captchaVerified || sendSucceed}
          loading={isSubmitting}
          color={sendSucceed ? "success" : "primary"}
          type={"submit"}
        >
          {sendSucceed ? "密码重置邮件发送成功" : "发送"}
        </Button>
      </Form>
      <div>
        <HistoryLink className={"text-link hover:underline"} to={{ pathname: "/login", search: params.toString() }}>
          返回登录
        </HistoryLink>
      </div>
    </div>
  );
}
