import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { RecursiveKeyValuePair } from "tailwindcss/types/config";
import { scrollbar } from "./plugins/scrollbar";
import { borderRadius } from "./tokens/border-radius";
import { borderWidth } from "./tokens/border-width";
import { colorsPalette } from "./tokens/colors-palette";
import { colorsSemantic } from "./tokens/colors-semantic";
import { fontFamily } from "./tokens/font-family";
import { fontSize } from "./tokens/font-size";
import { fontWeight } from "./tokens/font-weight";
import { screens } from "./tokens/screens";
import { zIndex } from "./tokens/z-index";
import { flattenColorPalette, rgbFromHex } from "./utils/color";

type ThemesObject = Record<string, RecursiveKeyValuePair>;

export type PresetOptions = {
  themes?: ThemesObject;
  cssVarPrefix?: string;
};

const resolveConfig = (themes: ThemesObject, cssVarPrefix: string) => {
  const resolved: {
    utilities: Record<string, Record<string, string>>;
    colors: Record<string, string>;
  } = {
    utilities: {},
    colors: {},
  };

  for (const [themeName, theme] of Object.entries(themes)) {
    const cssSelector = themeName == "light" ? `:root, .${themeName}` : `.${themeName}`;

    resolved.utilities[cssSelector] = {};

    const flatColors = flattenColorPalette(theme);

    for (const [colorName, color] of Object.entries(flatColors)) {
      const rgb = rgbFromHex(color);
      const colorVariable = `--${cssVarPrefix}-${colorName}`;

      resolved.utilities[cssSelector][colorVariable] = `${rgb.r} ${rgb.g} ${rgb.b}`;
      resolved.colors[colorName] = `rgb(var(${colorVariable}) / <alpha-value>)`;
    }
  }

  return resolved;
};

const preset = (options: PresetOptions | undefined = {}): Partial<Config> => {
  const cssVarPrefix = options?.cssVarPrefix || "r";

  const resolved = resolveConfig(
    {
      light: colorsSemantic.light,
      dark: colorsSemantic.dark,
      ...options?.themes,
    },
    cssVarPrefix,
  );

  return {
    darkMode: "class",
    theme: {
      screens,
      fontFamily,
      fontSize,
      fontWeight,
      colors: { ...colorsPalette, ...resolved.colors },
      borderColor: ({ theme }) => ({
        ...theme("colors"),
        DEFAULT: `rgb(var(--${cssVarPrefix}-bd-normal))`,
      }),
      borderWidth,
      borderRadius,
      zIndex,
      extend: {
        keyframes: {
          "slide-down": {
            from: { height: "0" },
            to: { height: "var(--slide-height)" },
          },
          "slide-up": {
            from: { height: "var(--slide-height)" },
            to: { height: "0" },
          },
        },
      },
    },
    plugins: [
      plugin(({ addBase, addUtilities, addVariant, theme }) => {
        addBase({
          body: {
            fontSize: theme("fontSize.base"),
            lineHeight: theme("fontSize.base[1]", "lineHeight.normal"),
            color: `rgb(var(--${cssVarPrefix}-fg-normal))`,
            backgroundColor: `rgb(var(--${cssVarPrefix}-bg-normal))`,
          },
        });
        addUtilities(resolved.utilities);
        addVariant("active", ["&[data-active]", "&:active"]);
        addVariant("opened", "&[data-opened]");
      }),
      scrollbar(cssVarPrefix),
    ],
  };
};

export default { preset };
