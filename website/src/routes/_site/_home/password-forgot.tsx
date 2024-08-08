import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { unstable_defineAction } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { type SuccessData, createFieldErrors, httpProblem, isSuccess, mergeMeta } from "@resolid/framework/utils";
import { Button, Input } from "@resolid/react-ui";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { parseFormData, useRemixForm } from "remix-hook-form";
import { FormError } from "~/components/base/form-error";
import { HistoryLink } from "~/components/base/history-link";
import { trunstileVerify } from "~/extensions/turnstile/trunstile.server";
import { TurnstileWidget } from "~/extensions/turnstile/turnstile-widget";
import { userPasswordForgotService } from "~/modules/user/service.server";
import { type UserPasswordForgotFormData, userPasswordForgotResolver } from "~/modules/user/validator";

export const meta = mergeMeta(() => {
  return [{ title: "忘记密码" }];
});

export const action = unstable_defineAction(async ({ request, context }) => {
  const data = await parseFormData<UserPasswordForgotFormData>(request);

  const captcha = await trunstileVerify(data.token);

  if (!captcha.success) {
    return httpProblem(createFieldErrors({ captcha: "验证失败" }));
  }

  const [errors] = await userPasswordForgotService(data, context.requestOrigin ?? request.url);

  if (errors) {
    return httpProblem(errors);
  }

  return { success: true };
});

export default function PasswordForgot() {
  const [params] = useSearchParams();

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<TurnstileInstance>(null);

  const [sendSucceed, setSendSucceed] = useState(false);

  const data = useActionData<typeof action>();

  useEffect(() => {
    if (isSuccess(data as SuccessData)) {
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
  });

  return (
    <div className={"mx-auto flex max-w-96 flex-col gap-5 py-10"}>
      <h3 className={"text-center font-bold text-xl"}>忘记密码</h3>
      <p className={"text-center text-fg-subtle text-sm"}>输入你的电子邮箱，我们将向你发送用于重置密码的链接。</p>
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
          className={"tracking-widest"}
          disabled={!captchaVerified || sendSucceed}
          block
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
