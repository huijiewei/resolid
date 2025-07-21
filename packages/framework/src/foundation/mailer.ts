import nodemailer, { type Transport } from "nodemailer";
import type { Attachment, Options } from "nodemailer/lib/mailer";

export type MailOptions = Options & {
  attachments?: (Attachment & { href?: string })[];
};

export type MailSendResult = {
  success: boolean;
  message?: string;
  messageId?: string;
};

export type DefineMailerOptions = {
  dsn: string;
  from: string;
  transport?: Transport;
};

export const defineMailer = ({ dsn, from, transport }: DefineMailerOptions) => {
  const transporter = getTransporter(dsn, from, transport);

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

const getTransporter = (dsn: string, from: string, defaultTransport?: Transport) => {
  if (defaultTransport) {
    return nodemailer.createTransport(defaultTransport, { from: from });
  }

  const url = new URL(dsn);

  const protocol = url.protocol.slice(0, -1);

  if (protocol == "smtp" || protocol == "smtps") {
    return nodemailer.createTransport(dsn, { from: from });
  }

  throw new Error(`不支持 ${protocol} 邮件传输适配器`);
};
