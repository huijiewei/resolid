import { type VariantProps, classed } from "../../utils/classed";

export const spinnerStyles = classed({
  variants: {
    size: {
      xs: "h-3 w-3 border-2",
      sm: "h-4 w-4 border-2",
      md: "h-5 w-5 border-2",
      lg: "h-6 w-6 border-3",
      xl: "h-7 w-7 border-3",
    },
    color: {
      primary: "border-t-fg-primary border-r-fg-primary border-b-bg-primary border-l-bg-primary",
      neutral: "border-t-fg-neutral border-r-fg-neutral border-b-bg-neutral border-l-bg-neutral",
      success: "border-t-fg-success border-r-fg-success border-b-bg-success border-l-bg-success",
      warning: "border-t-fg-warning border-r-fg-warning border-b-bg-warning border-l-bg-warning",
      danger: "border-t-fg-danger border-r-fg-danger border-b-bg-danger border-l-bg-danger",
    },
  },
});

export type SpinnerStyles = VariantProps<typeof spinnerStyles>;
