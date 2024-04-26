import { exit } from "node:process";
import { Command, type CreateCommand } from "@resolid/framework/cli";
import { mailer } from "~/foundation/mail.server";

export const mailCommand: CreateCommand = () => {
  const mail = new Command("mail");

  mail.description("电子邮件");

  mail
    .command("test")
    .description("测试发送")
    .action(async () => {
      const result = await mailer.send({
        to: "Huijie Wei <huijiewei@resolid.tech>",
        subject: "测试邮件系统",
        text: "测试文本邮件",
      });

      if (result.success) {
        console.log(`邮件发送成功: ${result.messageId}`);
      } else {
        console.warn(`邮件发送失败: ${result.message}`);
      }

      exit();
    });

  return mail;
};
