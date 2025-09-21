import type { ReactNode } from "react";

export type CreateTimezoneScriptOptions = {
  cookieName: string;
};

export const createTimezoneScript = ({ cookieName }: CreateTimezoneScriptOptions): ((nonce?: string) => ReactNode) => {
  return (nonce) => (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
        var tzCookie = document.cookie.split(";").find((c) => c.trim().startsWith("${cookieName}="));
        var tzInit = tzCookie && tzCookie.split("=").length == 2;

        if(!tzInit) {
          document.cookie="${cookieName}="+encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)+"; Max-Age=31536000; SameSite=Lax; path=/";
          window.location.reload();
        }
        `,
      }}
    />
  );
};
