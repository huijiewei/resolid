import { type VariantProps, classed } from "../../utils/classed";

export const dividerStyles = classed({
  variants: {
    color: {
      primary: "",
      neutral: "",
      success: "",
      warning: "",
      danger: "",
    },
    variant: {
      solid: "",
      dashed: "",
      dotted: "",
    },
    vertical: {
      true: "h-auto self-stretch",
      false: "w-full",
    },
    label: {
      true: 'flex items-center text-xs before:mr-2 after:ml-2 after:h-0 before:h-0 after:shrink before:shrink after:content-[""] before:content-[""]',
      false: "",
    },
    position: {
      left: "",
      right: "",
      center: "",
    },
  },
  compoundVariants: [
    {
      label: false,
      vertical: true,
      class: "border-s-[length:var(--size-var)]",
    },
    {
      label: false,
      vertical: false,
      class: "border-t-[length:var(--size-var)]",
    },
    {
      label: true,
      class: "after:border-t-[length:var(--size-var)] before:border-t-[length:var(--size-var)]",
    },
    {
      label: false,
      variant: "solid",
      class: "border-solid",
    },
    {
      label: false,
      variant: "dotted",
      class: "border-dotted",
    },
    {
      label: false,
      variant: "dashed",
      class: "border-dashed",
    },
    {
      label: true,
      variant: "solid",
      class: "after:border-solid before:border-solid",
    },
    {
      label: true,
      variant: "dotted",
      class: "after:border-dotted before:border-dotted",
    },
    {
      label: true,
      variant: "dashed",
      class: "after:border-dashed before:border-dashed",
    },
    {
      label: false,
      color: "primary",
      class: "border-bg-primary-pressed",
    },
    {
      label: false,
      color: "neutral",
      class: "border-bg-neutral-pressed",
    },
    {
      label: false,
      color: "success",
      class: "border-bg-success-pressed",
    },
    {
      label: false,
      color: "warning",
      class: "border-bg-warning-pressed",
    },
    {
      label: false,
      color: "danger",
      class: "border-bg-danger-pressed",
    },
    {
      label: true,
      color: "primary",
      class: "after:border-bg-primary-pressed before:border-bg-primary-pressed",
    },
    {
      label: true,
      color: "neutral",
      class: "after:border-bg-neutral-pressed before:border-bg-neutral-pressed",
    },
    {
      label: true,
      color: "success",
      class: "after:border-bg-success-pressed before:border-bg-success-pressed",
    },
    {
      label: true,
      color: "warning",
      class: "after:border-bg-warning-pressed before:border-bg-warning-pressed",
    },
    {
      label: true,
      color: "danger",
      class: "after:border-bg-danger-pressed before:border-bg-danger-pressed",
    },
    {
      label: true,
      position: "center",
      class: "after:grow before:grow after:basis-0 before:basis-0",
    },
    {
      label: true,
      position: "left",
      class: "after:grow before:grow-0 after:basis-0 before:basis-[5%]",
    },
    {
      label: true,
      position: "right",
      class: "before:grow after:grow-0 after:basis-[5%] before:basis-0",
    },
  ],
});

export type DividerStyleProps = VariantProps<typeof dividerStyles>;
