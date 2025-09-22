import type { ReactNode } from "react";

export type CreateTimezoneScriptOptions = {
  cookieName: string;
  fallback?: string;
};

export const createTimezoneScript = ({
  cookieName,
  fallback = "UTC",
}: CreateTimezoneScriptOptions): ((nonce?: string) => ReactNode) => {
  return (nonce) => (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
        function checkTimezone() {
          if (!navigator.cookieEnabled) { return; }

          var tzInit = document.cookie.split(";").find((c) => c.trim().startsWith("${cookieName}="))?.split("=")[1] ?? "${fallback}";
          var tzCurrent = Intl.DateTimeFormat().resolvedOptions().timeZone;

          if(decodeURIComponent(tzInit) != tzCurrent) {
            document.cookie="${cookieName}="+encodeURIComponent(tzCurrent)+"; Max-Age=31536000; SameSite=Lax; path=/";
            window.location.reload();
          }
        }

        checkTimezone();
        `,
      }}
    />
  );
};
