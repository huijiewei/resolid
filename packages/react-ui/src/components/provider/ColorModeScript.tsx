import { COLOR_MODE_STORAGE_KEY, COLOR_SCHEME_QUERY } from "./ColorModeProvider";

export const ColorModeScript = ({ nonce }: { nonce?: string }) => {
  return (
    <script
      id="resolid-color-mode-script"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
try {
  var dark = localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');
  if (dark ? dark == '"dark"' : matchMedia('${COLOR_SCHEME_QUERY}').matches) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
      `,
      }}
    />
  );
};
