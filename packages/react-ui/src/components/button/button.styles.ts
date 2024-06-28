import { type VariantProps, classed } from "../../utils/classed";

export const buttonStyles = classed({
  variants: {
    color: {
      primary: "focus-visible:ring-bg-primary-emphasis/35",
      neutral: "focus-visible:ring-bg-neutral-emphasis/35",
      success: "focus-visible:ring-bg-success-emphasis/35",
      warning: "focus-visible:ring-bg-warning-emphasis/35",
      danger: "focus-visible:ring-bg-danger-emphasis/35",
    },
    variant: {
      solid: "border-transparent text-fg-emphasized",
      outline: "border-current",
      soft: "border-transparent",
      ghost: "border-transparent",
      link: "border-transparent underline underline-offset-2",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
      xl: "text-base",
    },
    disabled: {
      true: "cursor-not-allowed opacity-70 grayscale-[30%]",
      false: "cursor-pointer",
    },
    loading: {
      true: "cursor-wait opacity-80 grayscale-[20%]",
    },
    block: {
      true: "w-full",
      false: "w-auto",
    },
    square: {
      true: "aspect-square",
      false: "",
    },
    padded: {
      true: "",
      false: "p-0",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
    variant: "solid",
    disabled: false,
    block: false,
    square: false,
    padded: true,
  },
  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      className: "bg-bg-primary-emphasis",
    },
    {
      color: "primary",
      variant: "solid",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-primary-emphasis-hovered active:bg-bg-primary-emphasis-pressed",
    },
    {
      color: "primary",
      variant: ["outline", "ghost", "soft"],
      className: "text-fg-primary",
    },
    {
      color: "primary",
      variant: "outline",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-primary active:bg-bg-primary-hovered",
    },
    {
      color: "primary",
      variant: "soft",
      className: "bg-bg-primary",
    },
    {
      color: "primary",
      variant: "soft",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-primary-hovered active:bg-bg-primary-pressed",
    },
    {
      color: "primary",
      variant: "ghost",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-primary active:bg-bg-primary-hovered",
    },
    {
      color: "primary",
      variant: "link",
      disabled: false,
      loading: false,
      className: "hover:text-fg-primary-hovered active:text-fg-primary-pressed",
    },
    {
      color: "neutral",
      variant: "solid",
      className: "bg-bg-neutral-emphasis",
    },
    {
      color: "neutral",
      variant: "solid",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-neutral-emphasis-hovered active:bg-bg-neutral-emphasis-pressed",
    },
    {
      color: "neutral",
      variant: "outline",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-neutral active:bg-bg-neutral-hovered",
    },
    {
      color: "neutral",
      variant: "soft",
      className: "bg-bg-neutral",
    },
    {
      color: "neutral",
      variant: "soft",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-neutral-hovered active:bg-bg-neutral-pressed",
    },
    {
      color: "neutral",
      variant: "ghost",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-neutral active:bg-bg-neutral-hovered",
    },
    {
      color: "neutral",
      variant: "link",
      disabled: false,
      loading: false,
      className: "hover:text-fg-neutral-hovered active:text-fg-neutral-pressed",
    },
    {
      color: "success",
      variant: "solid",
      className: "bg-bg-success-emphasis",
    },
    {
      color: "success",
      variant: "solid",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-success-emphasis-hovered active:bg-bg-success-emphasis-pressed",
    },
    {
      color: "success",
      variant: ["outline", "ghost", "soft"],
      className: "text-fg-success",
    },
    {
      color: "success",
      variant: "outline",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-success active:bg-bg-success-hovered",
    },
    {
      color: "success",
      variant: "soft",
      className: "bg-bg-success hover:bg-bg-success-hovered active:bg-bg-success-pressed",
    },
    {
      color: "success",
      variant: "ghost",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-success active:bg-bg-success-hovered",
    },
    {
      color: "success",
      variant: "link",
      disabled: false,
      loading: false,
      className: "hover:text-fg-success-hovered active:text-fg-success-pressed",
    },
    {
      color: "warning",
      variant: "solid",
      className: "bg-bg-warning-emphasis",
    },
    {
      color: "warning",
      variant: "solid",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-warning-emphasis-hovered active:bg-bg-warning-emphasis-pressed",
    },
    {
      color: "warning",
      variant: ["outline", "ghost", "soft"],
      className: "text-fg-warning",
    },
    {
      color: "warning",
      variant: "outline",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-warning active:bg-bg-warning-hovered",
    },
    {
      color: "warning",
      variant: "soft",
      className: "bg-bg-warning",
    },
    {
      color: "warning",
      variant: "soft",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-warning-hovered active:bg-bg-warning-pressed",
    },
    {
      color: "warning",
      variant: "ghost",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-warning active:bg-bg-warning-hovered",
    },
    {
      color: "warning",
      variant: "link",
      disabled: false,
      loading: false,
      className: "hover:text-fg-warning-hovered active:text-fg-warning-pressed",
    },
    {
      color: "danger",
      variant: "solid",
      className: "bg-bg-danger-emphasis",
    },
    {
      color: "danger",
      variant: "solid",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-danger-emphasis-hovered active:bg-bg-danger-emphasis-pressed",
    },
    {
      color: "danger",
      variant: ["outline", "ghost", "soft"],
      className: "text-fg-danger",
    },
    {
      color: "danger",
      variant: "outline",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-danger active:bg-bg-danger-hovered",
    },
    {
      color: "danger",
      variant: "soft",
      className: "bg-bg-danger",
    },
    {
      color: "danger",
      variant: "soft",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-danger-hovered active:bg-bg-danger-pressed",
    },
    {
      color: "danger",
      variant: "ghost",
      disabled: false,
      loading: false,
      className: "hover:bg-bg-danger active:bg-bg-danger-hovered",
    },
    {
      color: "danger",
      variant: "link",
      disabled: false,
      loading: false,
      className: "hover:text-fg-danger-hovered active:text-fg-danger-pressed",
    },
    {
      size: "xs",
      square: false,
      padded: true,
      className: "px-2.5",
    },
    {
      size: "sm",
      square: false,
      padded: true,
      className: "px-3",
    },
    {
      size: "md",
      square: false,
      padded: true,
      className: "px-3.5",
    },
    {
      size: "lg",
      square: false,
      padded: true,
      className: "px-4",
    },
    {
      size: "xl",
      square: false,
      padded: true,
      className: "px-5",
    },
    {
      size: "xs",
      padded: true,
      className: "h-7",
    },
    {
      size: "sm",
      padded: true,
      className: "h-8",
    },
    {
      size: "md",
      padded: true,
      className: "h-9",
    },
    {
      size: "lg",
      padded: true,
      className: "h-10",
    },
    {
      size: "xl",
      padded: true,
      className: "h-11",
    },
  ],
});

export type ButtonStyleProps = VariantProps<typeof buttonStyles>;
