import { type VariantProps, classed } from "../../utils/classed";

export const spinnerStyles = classed("inline-block animate-spin rounded-full", {
  variants: {
    size: {
      xs: "h-3 w-3 border-2",
      sm: "h-4 w-4 border-2",
      md: "h-5 w-5 border-2",
      lg: "h-6 w-6 border-3",
      xl: "h-7 w-7 border-3",
    },
    color: {
      primary: "border-b-bg-primary border-l-bg-primary border-r-fg-primary border-t-fg-primary",
      neutral: "border-t-fg-neutral border-r-fg-neutral border-b-bg-neutral border-l-bg-neutral",
      success: "border-b-bg-success border-l-bg-success border-r-fg-success border-t-fg-success",
      warning: "border-b-bg-warning border-l-bg-warning border-r-fg-warning border-t-fg-warning",
      danger: "border-b-bg-danger border-l-bg-danger border-r-fg-danger border-t-fg-danger",
    },
  },
});

export type SpinnerStyles = VariantProps<typeof spinnerStyles>;
