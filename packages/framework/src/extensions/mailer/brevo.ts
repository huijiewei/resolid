import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import type { SentMessageInfo, Transport } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type MailMessage from "nodemailer/lib/mailer/mail-message";
import { version as VERSION } from "../../../package.json";

type MailAddress = { address: string; name: string };

export const transport = (url: URL): Transport<SentMessageInfo> => {
  const apiUrl = "https://api.brevo.com/v3/smtp/email";
  const apiKey = url.username;

  const transformAddresses = (addresses: string[]) => {
    return (addresses as unknown as MailAddress[]).map((address) => {
      return { name: address.name.length > 0 ? address.name : undefined, email: address.address };
    });
  };

  const readableToBase64 = async (stream: Readable): Promise<string> => {
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks).toString("base64");
  };

  const transformAttachment = async (attachment: Attachment & { href?: string }) => {
    if (attachment.raw) {
      throw new Error("不支持 raw 类型的附件");
    }

    if (attachment.href && attachment.href.length > 0) {
      return { url: attachment.href };
    }

    if (!attachment.filename || attachment.filename.length == 0) {
      throw new Error("附件 filename 不能为空");
    }

    if (typeof attachment.path == "string") {
      return {
        name: attachment.filename,
        content: (await readFile(attachment.path)).toString("base64"),
      };
    }

    if (typeof attachment.content == "string") {
      return {
        name: attachment.filename,
        content:
          attachment.encoding === "base64"
            ? attachment.content
            : Buffer.from(attachment.content, attachment.encoding as BufferEncoding).toString("base64"),
      };
    }

    if (Buffer.isBuffer(attachment.content)) {
      return {
        name: attachment.filename,
        content: attachment.content.toString("base64"),
      };
    }

    // noinspection SuspiciousTypeOfGuard
    if (attachment.content instanceof Readable) {
      return {
        name: attachment.filename,
        content: await readableToBase64(attachment.content),
      };
    }

    throw new Error("不支持的附件类型");
  };

  const buildRequestInit = async (mail: MailMessage): Promise<RequestInit> => {
    const addresses = mail.message.getAddresses();

    if (!addresses.from || addresses.from.length != 1) {
      throw new Error("from 地址不能为空或者为多个");
    }

    if (!addresses.to || addresses.to.length == 0) {
      throw new Error("to 地址不能为空");
    }

    return {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: transformAddresses(addresses.from)[0],
        to: transformAddresses(addresses.to),
        cc: addresses.cc && transformAddresses(addresses.cc),
        bcc: addresses.bcc && transformAddresses(addresses.bcc),
        replyTo: addresses["reply-to"] && transformAddresses(addresses["reply-to"]),
        headers: mail.data.headers && Object.keys(mail.data.headers).length > 0 ? mail.data.headers : undefined,
        subject: mail.data.subject,
        textContent: mail.data.text,
        htmlContent: mail.data.html,
        attachment:
          mail.data.attachments && mail.data.attachments.length > 0
            ? await Promise.all(mail.data.attachments.map((attachment) => transformAttachment(attachment)))
            : undefined,
      }),
    } as RequestInit;
  };

  return {
    name: "BrevoTransport",
    version: VERSION,
    send: (mail, callback) => {
      buildRequestInit(mail)
        .then((init) => {
          fetch(apiUrl, init)
            .then((response) => {
              if (response.ok) {
                response.json().then((json) => {
                  callback(null, { messageId: json.messageId });
                });
              } else {
                response.json().then((json) => {
                  callback(new Error(`发送邮件失败, ${json.message}`), null);
                });
              }
            })
            .catch((e) => callback(e, null));
        })
        .catch((e) => callback(e, null));
    },
  };
};
