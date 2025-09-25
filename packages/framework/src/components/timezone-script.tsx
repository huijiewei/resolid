export type TimezoneScriptProps = {
  cookieName: string;
  fallback?: string;
  nonce?: string;
};

export const TimezoneScript = ({ cookieName, fallback, nonce }: TimezoneScriptProps) => {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `function checkTimezone(){if(navigator.cookieEnabled){var o=document.cookie.split(";").find(t=>t.trim().startsWith("${cookieName}="))?.split("=")[1]??"${fallback}",e=Intl.DateTimeFormat().resolvedOptions().timeZone;decodeURIComponent(o)!=e&&(document.cookie="${cookieName}="+encodeURIComponent(e)+"; Max-Age=31536000; SameSite=Lax; path=/",window.location.reload())}}checkTimezone();`,
      }}
    />
  );
};
