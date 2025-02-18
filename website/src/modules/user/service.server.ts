import { format } from "@formkit/tempo";
import { eq } from "@resolid/framework/drizzle";
import { authUtils } from "@resolid/framework/modules";
import {
  type AuthIdentity,
  createAuthLoginService,
  createAuthPasswordForgotService,
  createAuthPasswordResetService,
  createAuthSessionService,
  createAuthSignupService,
} from "@resolid/framework/modules.server";
import { omit } from "@resolid/utils";
import { env } from "node:process";
import { UAParser } from "ua-parser-js";
import { passwordForgotRender } from "~/extensions/email/passwordForgotEmail.server";
import { db } from "~/foundation/db.server";
import { mailer } from "~/foundation/mail.server";
import {
  userGroupTable,
  userPasswordResetTable,
  type UserSelect,
  type UserSelectWithGroup,
  userSessionTable,
  userTable,
} from "~/modules/user/schema.server";
import {
  type UserLoginFormData,
  userLoginResolver,
  type UserPasswordForgotFormData,
  userPasswordForgotResolver,
  type UserPasswordResetFormData,
  userPasswordResetResolver,
  type UserSignupFormData,
  userSignupResolver,
} from "~/modules/user/validator";

export const userSessionService = createAuthSessionService<UserSelectWithGroup>(
  db,
  userTable,
  userGroupTable,
  userSessionTable,
);

export const userPasswordResetEmailService = async (
  identity: AuthIdentity<UserSelect>,
  baseUrl: string,
  resetUrl: string,
  expiredAt: Date,
  userAgent: string,
) => {
  const userDisplayName = authUtils.getDisplayName(identity);
  const ua = UAParser(userAgent);

  const { html, text } = await passwordForgotRender({
    baseUrl,
    resetUrl,
    userDisplayName,
    expiredAtTime: format(expiredAt, "YYYY-MM-DD HH:mm"),
    supportEmail: env.RX_SUPPORT_EMAIL,
    uaOs: `${ua.os.name} ${ua.os.version}`,
    uaBrowser: `${ua.browser.name} ${ua.browser.major}`,
  });

  return await mailer.send({
    to: {
      name: userDisplayName,
      address: identity.email,
    },
    subject: "Resolid 密码重置",
    text: text,
    html: html,
  });
};

export const userService = {
  getByUsername: async (username: string) => {
    const users = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1);

    if (users.length == 0) {
      return undefined;
    }

    return omit(users[0], [
      "password",
      "deletedAt",
      "emailVerifiedAt",
      "updatedAt",
      "createdAt",
      "createdFrom",
      "createdIp",
      "email",
      "groupId",
    ]);
  },
  login: createAuthLoginService<UserLoginFormData, UserSelectWithGroup>(
    db,
    userTable,
    userGroupTable,
    userLoginResolver,
  ),
  signup: createAuthSignupService<UserSignupFormData, UserSelectWithGroup>(
    db,
    userTable,
    userGroupTable,
    userSignupResolver,
  ),
  passwordForgot: createAuthPasswordForgotService<UserPasswordForgotFormData, UserSelect>(
    db,
    userTable,
    userPasswordResetTable,
    userPasswordForgotResolver,
  ),
  passwordReset: createAuthPasswordResetService<UserPasswordResetFormData>(
    db,
    userTable,
    userPasswordResetTable,
    userPasswordResetResolver,
  ),
};
