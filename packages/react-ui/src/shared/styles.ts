export const sharedBadgeAndAlertVariants = {
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
      outline: "border-current bg-bg-normal",
      soft: "border-transparent",
      subtle: "border-current",
    },
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
};

export const focusInputStyles = "focus:border-bg-primary-emphasis focus:ring-1 focus:ring-bg-primary-emphasis";

export const focusRingStyles = "focus-visible:ring";

export const peerFocusRingStyles = "peer-focus-visible:ring";

export const disabledStyles = "opacity-70 grayscale-[30%]";

export const sharedSwitchCheckboxRadioColorStyles = {
  primary: {
    focus: "peer-focus-visible:ring-bg-primary-emphasis/35",
    checked: "bg-bg-primary-emphasis",
  },
  neutral: {
    focus: "peer-focus-visible:ring-bg-neutral-emphasis/35",
    checked: "bg-bg-neutral-emphasis",
  },
  success: {
    focus: "peer-focus-visible:ring-bg-success-emphasis/35",
    checked: "bg-bg-success-emphasis",
  },
  warning: {
    focus: "peer-focus-visible:ring-bg-warning-emphasis/35",
    checked: "bg-bg-warning-emphasis",
  },
  danger: {
    focus: "peer-focus-visible:ring-bg-danger-emphasis/35",
    checked: "bg-bg-danger-emphasis",
  },
};

export const sharedCheckboxRadioColorStyles = {
  primary: {
    ...sharedSwitchCheckboxRadioColorStyles.primary,
    border: "border-bg-primary-emphasis",
  },
  neutral: {
    ...sharedSwitchCheckboxRadioColorStyles.neutral,
    border: "border-bg-neutral-emphasis",
  },
  success: {
    ...sharedSwitchCheckboxRadioColorStyles.success,
    border: "border-bg-success-emphasis",
  },
  warning: {
    ...sharedSwitchCheckboxRadioColorStyles.warning,
    border: "border-bg-warning-emphasis",
  },
  danger: {
    ...sharedSwitchCheckboxRadioColorStyles.danger,
    border: "border-bg-danger-emphasis",
  },
};

export const sharedCheckboxRadioSizeStyles = {
  xs: { control: "h-3.5 w-3.5", label: "text-xs" },
  sm: { control: "h-4 w-4", label: "text-sm" },
  md: { control: "h-5 w-5", label: "text-base" },
  lg: { control: "h-6 w-6", label: "text-base" },
  xl: { control: "h-7 w-7", label: "text-lg" },
};

export const sharedInputTextStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
  xl: "text-lg",
};
