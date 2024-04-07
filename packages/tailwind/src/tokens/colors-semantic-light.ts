import { colorsPalette } from "./colors-palette";

export const colorsSemanticLight = {
  fg: {
    normal: colorsPalette.black,
    emphasized: colorsPalette.white,
    muted: colorsPalette.gray[600],
    subtle: colorsPalette.gray[500],
    subtlest: colorsPalette.gray[400],

    primary: {
      DEFAULT: colorsPalette.blue[500],
      hovered: colorsPalette.blue[600],
      pressed: colorsPalette.blue[700],
      emphasized: colorsPalette.blue[50],
    },
    success: {
      DEFAULT: colorsPalette.green[500],
      hovered: colorsPalette.green[600],
      pressed: colorsPalette.green[700],
      emphasized: colorsPalette.green[50],
    },
    warning: {
      DEFAULT: colorsPalette.yellow[500],
      hovered: colorsPalette.yellow[600],
      pressed: colorsPalette.yellow[700],
      emphasized: colorsPalette.yellow[50],
    },
    danger: {
      DEFAULT: colorsPalette.red[500],
      hovered: colorsPalette.red[600],
      pressed: colorsPalette.red[700],
      emphasized: colorsPalette.red[50],
    },
  },
  bg: {
    normal: colorsPalette.white,
    emphasized: colorsPalette.gray[900],
    muted: colorsPalette.gray[200],
    subtle: colorsPalette.gray[100],
    subtlest: colorsPalette.gray[50],

    primary: {
      DEFAULT: colorsPalette.blue[50],
      hovered: colorsPalette.blue[100],
      pressed: colorsPalette.blue[200],
      emphasis: {
        DEFAULT: colorsPalette.blue[500],
        hovered: colorsPalette.blue[600],
        pressed: colorsPalette.blue[700],
      },
    },

    neutral: {
      DEFAULT: colorsPalette.gray[50],
      hovered: colorsPalette.gray[100],
      pressed: colorsPalette.gray[200],
      emphasis: {
        DEFAULT: colorsPalette.gray[800],
        hovered: colorsPalette.gray[900],
        pressed: colorsPalette.black,
      },
    },

    success: {
      DEFAULT: colorsPalette.green[50],
      hovered: colorsPalette.green[100],
      pressed: colorsPalette.green[200],
      emphasis: {
        DEFAULT: colorsPalette.green[500],
        hovered: colorsPalette.green[600],
        pressed: colorsPalette.green[700],
      },
    },

    warning: {
      DEFAULT: colorsPalette.yellow[50],
      hovered: colorsPalette.yellow[100],
      pressed: colorsPalette.yellow[200],
      emphasis: {
        DEFAULT: colorsPalette.yellow[500],
        hovered: colorsPalette.yellow[600],
        pressed: colorsPalette.yellow[700],
      },
    },

    danger: {
      DEFAULT: colorsPalette.red[50],
      hovered: colorsPalette.red[100],
      pressed: colorsPalette.red[200],
      emphasis: {
        DEFAULT: colorsPalette.red[500],
        hovered: colorsPalette.red[600],
        pressed: colorsPalette.red[700],
      },
    },
  },
  bd: {
    normal: colorsPalette.gray[200],
    subtle: colorsPalette.gray[100],
    hovered: colorsPalette.gray[300],
    invalid: colorsPalette.red[500],
  },
  link: {
    DEFAULT: colorsPalette.blue[500],
    hovered: colorsPalette.blue[600],
    pressed: colorsPalette.blue[700],
  },
};
