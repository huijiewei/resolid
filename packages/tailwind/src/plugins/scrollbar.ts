import plugin from "tailwindcss/plugin";

export const scrollbar = (cssVarPrefix: string) => {
  return plugin(({ addUtilities }) => {
    addUtilities({
      ".scrollbar": {
        "&::-webkit-scrollbar-thumb": {
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "transparent",
          borderRadius: "6px",
          backgroundClip: "padding-box",
          backgroundColor: `rgb(var(--${cssVarPrefix}-bd-normal))`,
        },
      },
      ".scrollbar-base": {
        "&::-webkit-scrollbar": {
          width: "12px",
          height: "12px",
        },
      },
      ".scrollbar-thin": {
        "&::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
      },
    });
  });
};
