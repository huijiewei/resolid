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
import { flattenColorPalette, rgbFromHex } from "./utils/color";

type DefaultThemeType = "light" | "dark";

type ThemesObject = Record<string, RecursiveKeyValuePair>;

export type PresetOptions = {
  themes?: ThemesObject;
  defaultTheme?: DefaultThemeType;
  cssVarPrefix?: string;
};

const resolveConfig = (themes: ThemesObject, defaultTheme: DefaultThemeType, cssVarPrefix: string) => {
  const resolved: {
    utilities: Record<string, Record<string, string>>;
    colors: Record<string, string>;
  } = {
    utilities: {},
    colors: {},
  };

  Object.keys(themes).forEach((themeName) => {
    let cssSelector = `.${themeName}`;

    if (themeName === defaultTheme) {
      cssSelector = `:root, ${cssSelector}`;
    }

    resolved.utilities[cssSelector] = {};

    const flatColors = flattenColorPalette(themes[themeName]);

    Object.keys(flatColors).forEach((colorName) => {
      const colorValue = flatColors[colorName];

      if (!colorValue) {
        return;
      }

      const rgb = rgbFromHex(colorValue);

      const colorVariable = `--${cssVarPrefix}-${colorName}`;

      resolved.utilities[cssSelector][colorVariable] = `${rgb.r} ${rgb.g} ${rgb.b}`;

      resolved.colors[colorName] = `rgb(var(${colorVariable}) / <alpha-value>)`;
    });
  });

  return resolved;
};

const preset = (options: PresetOptions | undefined = {}): Partial<Config> => {
  const cssVarPrefix = options?.cssVarPrefix || "r";

  const resolved = resolveConfig(
    {
      light: colorsSemantic.light,
      dark: colorsSemantic.dark,
    },
    options?.defaultTheme || "light",
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
        DEFAULT: `rgb(var(--${cssVarPrefix}-border-normal))`,
      }),
      borderWidth,
      borderRadius,
    },
    plugins: [
      plugin(({ addBase, addUtilities, theme }) => {
        addBase({
          body: {
            fontSize: theme("fontSize.base"),
            lineHeight: theme("fontSize.base[1]", "lineHeight.normal"),
            color: `rgb(var(--${cssVarPrefix}-fg-normal))`,
            backgroundColor: `rgb(var(--${cssVarPrefix}-bg-normal))`,
          },
        });
        addUtilities(resolved.utilities);
      }),
      scrollbar(cssVarPrefix),
    ],
  };
};

export default { preset };
