import { classed, type VariantProps } from "../../utils/classed";

export const badgeStyles = classed("inline-flex items-center", {
  variants: {
    color: {
      primary: "",
      neutral: "",
      success: "",
      warning: "",
      danger: "",
    },
    variant: {
      solid: "border-transparent text-fg-emphasized",
      outline: "border-current",
      soft: "border-transparent",
      subtle: "border-current",
    },
  },
  defaultVariants: {
    color: "primary",
    variant: "solid",
  },
  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      className: "bg-bg-primary-emphasis",
    },
    {
      color: "primary",
      variant: ["outline", "soft", "subtle"],
      className: "text-fg-primary",
    },
    {
      color: "primary",
      variant: ["soft", "subtle"],
      className: "bg-bg-primary",
    },
    {
      color: "neutral",
      variant: "solid",
      className: "bg-bg-neutral-emphasis",
    },
    {
      color: "neutral",
      variant: ["soft", "subtle"],
      className: "bg-bg-neutral",
    },
    {
      color: "success",
      variant: "solid",
      className: "bg-bg-success-emphasis",
    },
    {
      color: "success",
      variant: ["outline", "soft", "subtle"],
      className: "text-fg-success",
    },
    {
      color: "success",
      variant: ["soft", "subtle"],
      className: "bg-bg-success",
    },

    {
      color: "warning",
      variant: "solid",
      className: "bg-bg-warning-emphasis",
    },
    {
      color: "warning",
      variant: ["outline", "soft", "subtle"],
      className: "text-fg-warning",
    },
    {
      color: "warning",
      variant: ["soft", "subtle"],
      className: "bg-bg-warning",
    },
    {
      color: "danger",
      variant: "solid",
      className: "bg-bg-danger-emphasis",
    },
    {
      color: "danger",
      variant: ["outline", "soft", "subtle"],
      className: "text-fg-danger",
    },
    {
      color: "danger",
      variant: ["soft", "subtle"],
      className: "bg-bg-danger",
    },
  ],
});

export type BadgeStyleProps = VariantProps<typeof badgeStyles>;
