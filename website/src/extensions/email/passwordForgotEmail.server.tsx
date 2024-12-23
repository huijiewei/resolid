import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from "@react-email/components";

export type PasswordForgotEmailProps = {
  baseUrl: string;
  resetUrl: string;
  userDisplayName: string;
  expiredAtTime: string;
  supportEmail: string;
  uaOs: string;
  uaBrowser: string;
};

// eslint-disable-next-line react-refresh/only-export-components
const PasswordForgotTemplate = ({
  baseUrl,
  resetUrl,
  userDisplayName,
  expiredAtTime,
  supportEmail,
  uaOs,
  uaBrowser,
}: PasswordForgotEmailProps) => {
  const logoUrl = new URL("/images/resolid.png", baseUrl).toString();

  return (
    <Html>
      <Head />
      <Preview>Resolid 密码重置</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={logoUrl} width="200" height="30" alt="Resolid Tech" />
          <Section>
            <Text style={text}>你好，{userDisplayName},</Text>
            <Text style={text}>
              您最近请求重置您的 Resolid 帐户的密码。使用下面的按钮来重置它。此密码重置在 {expiredAtTime} 前有效。
            </Text>
            <Button style={button} href={resetUrl}>
              重置密码
            </Button>
            <Text style={text}>
              出于安全考虑，我们收到此请求时显示使用的是 {uaOs} 设备和 {uaBrowser}{" "}
              浏览器。如果您没有请求重置密码，请忽略此邮件，如有疑问请联系{" "}
              <Link href={`mailto:${supportEmail}`} style={anchor}>
                {supportEmail}
              </Link>
              。
            </Text>
            <Text style={text}>谢谢，</Text>
            <Text style={text}>Resolid 团队</Text>
          </Section>
        </Container>
        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>Copyright Ⓒ 2022-present Resolid Tech</Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "13px 7px",
};

const anchor = {
  textDecoration: "underline",
};

const footer = {
  margin: "0 auto",
};

export const passwordForgotRender = async (props: PasswordForgotEmailProps) => {
  return {
    html: await render(<PasswordForgotTemplate {...props} />, {
      pretty: true,
    }),
    text: await render(<PasswordForgotTemplate {...props} />, {
      plainText: true,
    }),
  };
};
