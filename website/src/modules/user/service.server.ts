import {
  authUtils,
  createAuthLoginService,
  createAuthPasswordForgotService,
  createAuthPasswordResetService,
  createAuthSessionService,
  createAuthSignupService,
} from "@resolid/framework/modules";
import { db } from "~/foundation/db.server";
import { mailer } from "~/foundation/mail.server";
import {
  userGroupTable,
  userPasswordResetTable,
  userSessionTable,
  userTable,
  type UserGroupTable,
  type UserSelectWithGroup,
  type UserSessionTable,
  type UserTable,
} from "~/modules/user/schema.server";
import { userSignupResolver } from "~/modules/user/validator";

export const userLoginService = createAuthLoginService(db, userTable, userGroupTable);

export const userSignupService = createAuthSignupService(db, userTable, userGroupTable, userSignupResolver);

export const userSessionService = createAuthSessionService<
  UserSelectWithGroup,
  UserTable,
  UserGroupTable,
  UserSessionTable
>(db, userTable, userGroupTable, userSessionTable);

export const userPasswordForgotService = createAuthPasswordForgotService(
  db,
  userTable,
  userPasswordResetTable,
  async (user, resetId, requestOrigin) => {
    const userDisplayName = authUtils.getDisplayName(user);
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
      return [{ email: "邮件发送失败" }, undefined];
    }

    return [undefined, true];
  },
);

export const userPasswordResetService = createAuthPasswordResetService(db, userTable, userPasswordResetTable);
