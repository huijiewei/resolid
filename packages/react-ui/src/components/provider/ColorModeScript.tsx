import { COLOR_MODE_STORAGE_KEY, COLOR_SCHEME_QUERY } from "./colorModeConstant";

export const ColorModeScript = ({ nonce }: { nonce?: string }) => {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `try{var dark=localStorage.getItem("${COLOR_MODE_STORAGE_KEY}");(dark?'"dark"'==dark:matchMedia("${COLOR_SCHEME_QUERY}").matches)&&document.documentElement.classList.add("dark")}catch(a){}`,
      }}
    />
  );
};