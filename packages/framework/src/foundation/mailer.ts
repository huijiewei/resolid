import { env } from "node:process";
import nodemailer, { type SentMessageInfo, type Transport } from "nodemailer";
import type { Attachment, Options } from "nodemailer/lib/mailer";

export type MailOptions = Options & {
  attachments?: (Attachment & { href?: string })[] | undefined;
};

export type MailSendResult = {
  success: boolean;
  message?: string;
  messageId?: string;
};

export const defineMailer = async ({
  transport,
}: {
  transport?: Transport<SentMessageInfo>;
} = {}) => {
  const dsn = env.RX_MAILER_DSN;

  if (!dsn) {
    throw new Error("请先设置 RX_MAILER_DSN 环境变量");
  }

  const from = env.RX_MAILER_FROM;

  if (!from) {
    throw new Error("请先设置 RX_MAILER_FROM 环境变量");
  }

  const transporter = await getTransporter(dsn, from, transport);

  return {
    async send(email: MailOptions): Promise<MailSendResult> {
      try {
        const result = await transporter.sendMail(email);
        return { success: true, messageId: result.messageId };
      } catch (e) {
        return { success: false, message: (e as Error).message };
      }
    },
  };
};

const getTransporter = async (dsn: string, from: string, defaultTransport?: Transport<SentMessageInfo>) => {
  if (defaultTransport) {
    return nodemailer.createTransport(defaultTransport, { from: from });
  }

  const url = new URL(dsn);

  const protocol = url.protocol.slice(0, -1);

  if (protocol == "smtp" || protocol == "smtps") {
    return nodemailer.createTransport(dsn, { from: from });
  }

  const { transport } = await import(`../extensions/mailer/${protocol}.ts`);

  if (!transport) {
    throw new Error(`未能找到 ${protocol} 协议的邮件传输适配器`);
  }

  return nodemailer.createTransport(transport(url), { from: from });
};
