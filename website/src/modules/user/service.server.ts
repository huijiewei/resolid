import { hash } from "@node-rs/bcrypt";
import { and, eq, gt } from "@resolid/framework/drizzle";
import { userService, userUtils } from "@resolid/framework/modules";
import { userTable } from "@resolid/framework/schemas";
import { createFieldErrors, validateData, type ServiceResult } from "@resolid/framework/utils";
import { isEmpty, randomId } from "@resolid/utils";
import { db } from "~/foundation/db.server";
import { mailer } from "~/foundation/mail.server";
import { userPasswordResetTable } from "~/modules/user/schema.server";
import {
  userPasswordForgotResolver,
  userPasswordResetResolver,
  type UserPasswordForgotFormData,
  type UserPasswordResetFormData,
} from "~/modules/user/validator";

export const userPasswordForgotService = async (
  data: UserPasswordForgotFormData,
  requestOrigin: string,
): Promise<ServiceResult<UserPasswordForgotFormData, boolean>> => {
  const { errors, values } = await validateData(data, userPasswordForgotResolver);

  if (errors) {
    return [errors, undefined];
  }

  const user = await userService.getByEmail(values.email, false);

  if (!user || user.deletedAt != null) {
    return [createFieldErrors({ email: "用户不存在" }), undefined];
  }

  const resetId = randomId();

  await db.insert(userPasswordResetTable).values({
    id: resetId,
    userId: user.id,
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const userDisplayName = userUtils.getDisplayName(user);
  const resetUrl = new URL(`/password-reset?token=${resetId}`, requestOrigin).toString();

  const result = await mailer.send({
    to: {
      name: userDisplayName,
      address: user.email,
    },
    subject: "Resolid 密码重置",
    html: `
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <h3>你好, ${userDisplayName}</h3>

    <p>这是一封密码重置邮件，如果是你本人操作，请点击以下链接继续：</p>

    <p><a href="${resetUrl}" target="_blank" style="color:#218bff; text-decoration:underline;">密码重置</a></p>

    <p>如果你并没有执行此操作，你可以选择忽略此邮件。</p>

    <p>如果你无法点击 "密码重置" 链接, 请复制下面的链接到你的浏览器:</p>

    <p>${resetUrl}</p>

    <p>-----------------------------------------------------------</p>

    <p>Proudly made in 🇨🇳 by Resolid Tech, 2024</p>
  </body>
</html>
    `,
  });

  if (!result.success) {
    return [createFieldErrors({ email: "邮件发送失败" }), undefined];
  }

  return [undefined, true];
};

export const userPasswordResetService = async (
  data: UserPasswordResetFormData,
  token: string | null,
): Promise<ServiceResult<UserPasswordResetFormData, boolean>> => {
  if (isEmpty(token)) {
    return [createFieldErrors({ token: "无效的密码重置链接" }), undefined];
  }

  const { errors, values } = await validateData(data, userPasswordResetResolver);

  if (errors) {
    return [errors, undefined];
  }

  const reset = await db.query.userPasswordResetTable.findFirst({
    where: and(
      eq(userPasswordResetTable.id, token!),
      eq(userPasswordResetTable.redeemed, false),
      gt(userPasswordResetTable.expiredAt, new Date()),
    ),
  });

  if (!reset) {
    return [createFieldErrors({ token: "无效的密码重置链接" }), undefined];
  }

  await db
    .update(userTable)
    .set({
      password: await hash(values.password),
    })
    .where(eq(userTable.id, reset.userId));

  await db.update(userPasswordResetTable).set({ redeemed: true }).where(eq(userPasswordResetTable.id, reset.id));

  return [undefined, true];
};
