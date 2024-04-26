import { type VariantProps, classed } from "../../utils/classed";

export const dividerStyles = classed("m-0 border-0", {
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
      true: 'flex items-center text-xs before:mr-2 before:h-0 before:shrink before:content-[""] after:ml-2 after:h-0 after:shrink after:content-[""]',
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
      class: "before:border-t-[length:var(--size-var)] after:border-t-[length:var(--size-var)]",
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
      class: "before:border-solid after:border-solid",
    },
    {
      label: true,
      variant: "dotted",
      class: "before:border-dotted after:border-dotted",
    },
    {
      label: true,
      variant: "dashed",
      class: "before:border-dashed after:border-dashed",
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
      class: "before:border-bg-primary-pressed after:border-bg-primary-pressed",
    },
    {
      label: true,
      color: "neutral",
      class: "before:border-bg-neutral-pressed after:border-bg-neutral-pressed",
    },
    {
      label: true,
      color: "success",
      class: "before:border-bg-success-pressed after:border-bg-success-pressed",
    },
    {
      label: true,
      color: "warning",
      class: "before:border-bg-warning-pressed after:border-bg-warning-pressed",
    },
    {
      label: true,
      color: "danger",
      class: "before:border-bg-danger-pressed after:border-bg-danger-pressed",
    },
    {
      label: true,
      position: "center",
      class: "before:grow before:basis-0 after:grow after:basis-0",
    },
    {
      label: true,
      position: "left",
      class: "before:grow-0 before:basis-[5%] after:grow after:basis-0",
    },
    {
      label: true,
      position: "right",
      class: "before:grow before:basis-0 after:grow-0 after:basis-[5%]",
    },
  ],
});

export type DividerStyleProps = VariantProps<typeof dividerStyles>;
