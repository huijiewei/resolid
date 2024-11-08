import { env } from "node:process";
import { format } from "@formkit/tempo";
import { eq } from "@resolid/framework/drizzle";
import {
  type AuthIdentity,
  authUtils,
  createAuthLoginService,
  createAuthPasswordForgotService,
  createAuthPasswordResetService,
  createAuthSessionService,
  createAuthSignupService,
} from "@resolid/framework/modules";
import { omit } from "@resolid/utils";
import { UAParser } from "ua-parser-js";
import { passwordForgotRender } from "~/extensions/email/passwordForgotEmail.server";
import { db } from "~/foundation/db.server";
import { mailer } from "~/foundation/mail.server";
import {
  type UserSelect,
  type UserSelectWithGroup,
  userGroupTable,
  userPasswordResetTable,
  userSessionTable,
  userTable,
} from "~/modules/user/schema.server";
import { userSignupResolver } from "~/modules/user/validator";

export const userLoginService = createAuthLoginService<UserSelectWithGroup>(db, userTable, userGroupTable);

export const userSignupService = createAuthSignupService<UserSelectWithGroup>(
  db,
  userTable,
  userGroupTable,
  userSignupResolver,
);

export const userSessionService = createAuthSessionService<UserSelectWithGroup>(
  db,
  userTable,
  userGroupTable,
  userSessionTable,
);

export const userPasswordForgotService = createAuthPasswordForgotService<UserSelect>(
  db,
  userTable,
  userPasswordResetTable,
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

export const userPasswordResetService = createAuthPasswordResetService(db, userTable, userPasswordResetTable);

export const userServices = {
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
};
